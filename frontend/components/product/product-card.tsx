type ProductCardProps = {
  imageUrl: string;
  storeName: string;
  name: string;
  price: number;
};

export default function ProductCard({
  imageUrl,
  storeName,
  name,
  price,
}: ProductCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white">
      <div className="aspect-[4/3] w-full overflow-hidden bg-muted">
        <img src={imageUrl} alt={name} className="h-full w-full object-cover" />
      </div>

      <div className="space-y-2 p-4">
        <p className="text-sm text-muted-foreground">{storeName}</p>
        <h3 className="line-clamp-2 text-lg font-semibold text-foreground">
          {name}
        </h3>
        <p className="text-2xl font-bold text-foreground">฿{price}</p>
      </div>
    </div>
  );
}
