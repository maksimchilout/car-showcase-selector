import { useState, type ReactNode } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function LeadDialog({
  trigger,
  title,
  carName,
  kind,
}: {
  trigger: ReactNode;
  title: string;
  carName: string;
  kind: "test-drive" | "booking";
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    console.log("Lead", { kind, carName, name, phone });
    toast.success(
      kind === "test-drive" ? "Заявка на тест-драйв принята!" : "Заявка на бронь принята!",
      { description: `Мы свяжемся с вами в ближайшее время по поводу ${carName}.` },
    );
    setOpen(false);
    setName(""); setPhone("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Имя</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Иван" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Телефон</Label>
            <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+375 (29) 000-00-00" type="tel" required />
          </div>
          <p className="text-xs text-muted-foreground">
            Автомобиль: <span className="font-medium text-foreground">{carName}</span>
          </p>
          <Button type="submit" className="w-full">Отправить заявку</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
