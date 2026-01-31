import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createMenu } from "@/lib/services/menuService"
import { supabase } from "@/lib/supabaseClients"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { toast } from "sonner"
import { IconPlus, IconUpload } from "@tabler/icons-react"

export function AddMenuFunction() {
    const [name, setName] = useState("")
    const [price, setPrice] = useState("")
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const queryClient = useQueryClient()

    const { mutate, isPending } = useMutation({
        mutationFn: createMenu,
        onSuccess: () => {
            toast.success("Menu berhasil ditambahkan")
            setIsOpen(false)
            resetForm()
            queryClient.invalidateQueries({ queryKey: ['menus'] })
        },
        onError: (error) => {
            toast.error("Gagal menambahkan menu: " + error.message)
        }
    })

    const resetForm = () => {
        setName("")
        setPrice("")
        setImageFile(null)
        setPreviewUrl(null)
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setImageFile(file)
            setPreviewUrl(URL.createObjectURL(file))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name || !price) {
            toast.error("Nama dan harga harus diisi")
            return
        }

        let imageUrl = "https://placehold.co/200x120?text=No+Image"

        if (imageFile) {
            setIsUploading(true)
            try {
                const fileExt = imageFile.name.split('.').pop()
                const fileName = `${Date.now()}.${fileExt}`
                const filePath = `${fileName}`

                const { error: uploadError } = await supabase.storage
                    .from('menu-images')
                    .upload(filePath, imageFile)

                if (uploadError) {
                    throw uploadError
                }

                const { data } = supabase.storage
                    .from('menu-images')
                    .getPublicUrl(filePath)

                imageUrl = data.publicUrl
            } catch (error: any) {
                toast.error("Gagal mengupload gambar: " + error.message)
                setIsUploading(false)
                return
            } finally {
                setIsUploading(false)
            }
        }

        mutate({
            name,
            price: Number(price),
            image: imageUrl,
            is_visible: true
        })
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <IconPlus className="h-4 w-4" /> Tambah Menu
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Tambah Menu Baru</DialogTitle>
                        <DialogDescription>
                            Masukkan detail menu baru di sini. Klik simpan setelah selesai.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Nama
                            </Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="col-span-3"
                                placeholder="Nasi Goreng"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="price" className="text-right">
                                Harga
                            </Label>
                            <Input
                                id="price"
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="col-span-3"
                                placeholder="15000"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-start gap-4">
                            <Label htmlFor="image" className="text-right pt-2">
                                Gambar
                            </Label>
                            <div className="col-span-3 space-y-2">
                                <div className="flex items-center gap-2">
                                    <Input
                                        id="image"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                    <Label htmlFor="image" className="cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full">
                                        <IconUpload className="mr-2 h-4 w-4" />
                                        {imageFile ? "Ganti Gambar" : "Pilih Gambar"}
                                    </Label>
                                </div>
                                {previewUrl && (
                                    <div className="relative aspect-video w-full overflow-hidden rounded-md border">
                                        <img
                                            src={previewUrl}
                                            alt="Preview"
                                            className="h-full w-full object-cover"
                                        />
                                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-1 text-xs text-white truncate px-2">
                                            {imageFile?.name}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isPending || isUploading}>
                            {isUploading ? "Mengupload..." : (isPending ? "Menyimpan..." : "Simpan Menu")}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
