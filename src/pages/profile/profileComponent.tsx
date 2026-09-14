interface Props {
  title: string;
  dataInformation: string;
}

export function ProComponent({ title, dataInformation }: Props) {
  return (
    <div className="flex w-full items-center justify-between gap-4 border-b border-border py-3 last:border-b-0">
      <span className="text-sm text-muted-foreground">{title}</span>
      <span className="truncate text-sm font-medium text-foreground">
        {dataInformation}
      </span>
    </div>
  );
}
