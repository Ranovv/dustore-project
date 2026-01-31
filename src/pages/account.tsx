
import { useState, useRef } from "react";
import { useSession } from "@/lib/store/useSession";
import { supabase } from "@/lib/supabaseClients";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export default function AccountPage() {
    const { user, setUser } = useSession();
    const [name, setName] = useState(user?.name || "");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(user?.avatar || null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpdateProfile = async () => {
        setLoading(true);
        try {
            const updates: { data?: { name?: string }; password?: string } = {};
            if (name !== user?.name) {
                updates.data = { name };
            }
            if (password) {
                if (password !== confirmPassword) {
                    toast.error("Password tidak cocok");
                    setLoading(false);
                    return;
                }
                updates.password = password;
            }

            if (Object.keys(updates).length === 0) {
                toast.info("Tidak ada perubahan");
                setLoading(false);
                return;
            }

            const { data, error } = await supabase.auth.updateUser(updates);

            if (error) throw error;

            // Update local session
            if (data.user) {
                setUser({
                    ...user!,
                    name: data.user.user_metadata.name || user?.name || "",
                });
                toast.success("Profil berhasil diperbarui");
                setPassword("");
                setConfirmPassword("");
            }
        } catch (error: any) {
            toast.error(error.message || "Gagal memperbarui profil");
        } finally {
            setLoading(false);
        }
    };

    const handleUploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setLoading(true);
        try {
            // Check if bucket exists
            const { error: bucketError } = await supabase.storage.getBucket('avatars');

            if (bucketError) {
                const { error: createError } = await supabase.storage.createBucket('avatars', {
                    public: true,
                    fileSizeLimit: 1024 * 1024 * 2, // 2MB
                    allowedMimeTypes: ['image/*']
                });

                if (createError) {
                    console.error("Failed to create bucket:", createError);
                    // Don't throw here, let upload fail if it must, but warn user
                }
            }

            const fileExt = file.name.split('.').pop();
            const fileName = `${user?.id || 'unknown'}-${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            // Try to upload to 'avatars' bucket
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file, { upsert: true });

            if (uploadError) {
                console.error("Upload error:", uploadError);
                if (uploadError.message.includes("Bucket not found")) {
                    throw new Error("Bucket 'avatars' tidak ditemukan. Harap buat bucket 'avatars' (public) secara manual di Supabase Dashboard.");
                }
                if ((uploadError as any).statusCode === '400') {
                    throw new Error("Gagal upload (400). Periksa Policy (RLS) di Supabase Storage Anda. Izinkan SELECT/INSERT untuk public/authenticated.");
                }
                throw uploadError;
            }

            const { data: publicDesc } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            const publicUrl = publicDesc.publicUrl;

            // Update user metadata with avatar_url
            const { error: updateError } = await supabase.auth.updateUser({
                data: { avatar_url: publicUrl }
            });

            if (updateError) throw updateError;

            setAvatarUrl(publicUrl);
            // Update local session to trigger re-render if we stored avatar there
            if (user) {
                setUser({ ...user, avatar: publicUrl });
            }
            toast.success("Foto profil berhasil diunggah");

        } catch (error: any) {
            console.error("Catch error:", error);
            toast.error(error.message || "Gagal mengunggah foto.");
        } finally {
            setLoading(false);
            // Reset input so same file can be selected again
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Foto Profil</CardTitle>
                        <CardDescription>Ubah foto profil Anda</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-4">
                        <Avatar className="h-24 w-24">
                            <AvatarImage src={avatarUrl || ""} />
                            <AvatarFallback className="text-xl">{user?.name?.slice(0, 2).toUpperCase() || "US"}</AvatarFallback>
                        </Avatar>
                        <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={loading}>
                            {loading ? "Mengunggah..." : "Pilih Foto"}
                        </Button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleUploadAvatar}
                        />
                    </CardContent>
                </Card>

                <Card className="col-span-1 md:col-span-2">
                    <CardHeader>
                        <CardTitle>Informasi Pribadi</CardTitle>
                        <CardDescription>Perbarui nama dan password Anda</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" value={user?.email || ""} disabled />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="name">Nama Lengkap</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Nama Lengkap"
                            />
                        </div>

                        <Separator className="my-4" />

                        <div className="space-y-2">
                            <Label htmlFor="password">Password Baru</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Kosongkan jika tidak ingin mengubah"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Ulangi password baru"
                            />
                        </div>

                        <div className="flex justify-end mt-6">
                            <Button onClick={handleUpdateProfile} disabled={loading}>
                                {loading ? "Menyimpan..." : "Simpan Perubahan"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
