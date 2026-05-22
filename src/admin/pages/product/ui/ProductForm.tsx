import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { useForm } from 'react-hook-form';
import { AdminTitle } from '@/admin/components/AdminTitle';
import { Button } from '@/components/ui/button';
import { X, SaveAll, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Articulo } from '@/interfaces/articulo.interface';

interface Props {
  title: string;
  subTitle: string;
  product: Articulo;
  isPending: boolean;
  onSubmit: (data: Partial<Articulo> & { file?: File }) => Promise<void>;
}

interface FormInputs {
  nombre: string;
  descripcion: string;
  precio: number;
  cantidad: number;
}

export const ProductForm = ({ title, subTitle, product, onSubmit, isPending }: Props) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(product.foto ?? null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, formState: { errors }, watch } = useForm<FormInputs>({
    defaultValues: {
      nombre: product.nombre,
      descripcion: product.descripcion,
      precio: product.precio,
      cantidad: product.cantidad,
    },
  });

  const currentCantidad = watch('cantidad');

  // Resetear preview cuando cambia el producto (ej: navegar entre productos)
  useEffect(() => {
    setFile(null);
    setPreview(product.foto ?? null);
  }, [product]);

  function handleFileSelect(selectedFile: File) {
    if (preview?.startsWith('blob:')) URL.revokeObjectURL(preview);
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) handleFileSelect(f);
  }

  function handleDrag(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFileSelect(f);
  }

  function handleRemoveImage() {
    if (preview?.startsWith('blob:')) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function handleFormSubmit(formData: FormInputs) {
    await onSubmit({
      id_articulo: product.id_articulo,
      ...formData,
      precio: Number(formData.precio),
      cantidad: Number(formData.cantidad),
      file: file ?? undefined,
    });
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <div className="flex justify-between items-center">
        <AdminTitle title={title} subtitle={subTitle} />
        <div className="flex justify-end mb-10 gap-4">
          <Button variant="outline" type="button" asChild>
            <Link to="/admin/products" className="flex items-center gap-2">
              <X className="w-4 h-4" />
              Cancelar
            </Link>
          </Button>
          <Button type="submit" disabled={isPending}>
            <SaveAll className="w-4 h-4" />
            Guardar cambios
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Columna principal ─────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-6">Información del producto</h2>

              <div className="space-y-6">
                {/* Nombre */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Nombre</label>
                  <input
                    type="text"
                    {...register('nombre', { required: true })}
                    className={cn(
                      'w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200',
                      { 'border-red-500': errors.nombre }
                    )}
                    placeholder="Nombre del artículo"
                  />
                  {errors.nombre && <p className="text-red-500 text-sm mt-1">El nombre es requerido</p>}
                </div>

                {/* Descripción */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Descripción</label>
                  <textarea
                    {...register('descripcion', { required: true })}
                    rows={4}
                    className={cn(
                      'w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none',
                      { 'border-red-500': errors.descripcion }
                    )}
                    placeholder="Descripción del artículo"
                  />
                  {errors.descripcion && <p className="text-red-500 text-sm mt-1">La descripción es requerida</p>}
                </div>

                {/* Precio + Cantidad */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Precio ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      {...register('precio', { required: true, min: 0.01 })}
                      className={cn(
                        'w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200',
                        { 'border-red-500': errors.precio }
                      )}
                      placeholder="0.00"
                    />
                    {errors.precio && <p className="text-red-500 text-sm mt-1">El precio debe ser mayor a 0</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Cantidad en stock</label>
                    <input
                      type="number"
                      {...register('cantidad', { required: true, min: 0 })}
                      className={cn(
                        'w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200',
                        { 'border-red-500': errors.cantidad }
                      )}
                      placeholder="0"
                    />
                    {errors.cantidad && <p className="text-red-500 text-sm mt-1">La cantidad es requerida</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Sidebar ───────────────────────────────────────────── */}
          <div className="space-y-6">

            {/* Imagen */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-6">Imagen del producto</h2>

              {/* Drag & drop */}
              <div
                className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${dragActive ? 'border-blue-400 bg-blue-50' : 'border-slate-300 hover:border-slate-400'
                  }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleFileChange}
                />
                <div className="space-y-4">
                  <Upload className="mx-auto h-12 w-12 text-slate-400" />
                  <div>
                    <p className="text-lg font-medium text-slate-700">Arrastra la imagen aquí</p>
                    <p className="text-sm text-slate-500">o haz clic para buscar</p>
                  </div>
                  <p className="text-xs text-slate-400">PNG, JPG, WebP hasta 10MB</p>
                </div>
              </div>

              {/* Preview */}
              {preview && (
                <div className="mt-4 relative group">
                  <div className="aspect-square bg-slate-100 rounded-lg border border-slate-200 overflow-hidden">
                    <img src={preview} alt="Producto" className="w-full h-full object-cover" />
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>

            {/* Estado */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-6">Estado del producto</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm font-medium text-slate-700">Estado</span>
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Activo</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm font-medium text-slate-700">Inventario</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${currentCantidad > 5
                      ? 'bg-green-100 text-green-800'
                      : currentCantidad > 0
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                    {currentCantidad > 5 ? 'En stock' : currentCantidad > 0 ? 'Bajo stock' : 'Sin stock'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm font-medium text-slate-700">Imagen</span>
                  <span className="text-sm text-slate-600">{preview ? '1 imagen' : 'Sin imagen'}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </form>
  );
};