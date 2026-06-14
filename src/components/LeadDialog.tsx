import { useId, useState, type ReactNode } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { submitLead } from "@/lib/api/submitLead";
import { isPhoneValid, sanitizePhoneInput } from "@/lib/phone";

type FormStatus = "idle" | "success" | "error";

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
  const formId = useId();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [formStatus, setFormStatus] = useState<FormStatus>("idle");
  const [formMessage, setFormMessage] = useState("");

  const resetForm = () => {
    setName("");
    setPhone("");
    setPhoneError("");
    setFormStatus("idle");
    setFormMessage("");
  };

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) resetForm();
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || submitting) return;

    if (!isPhoneValid(phone)) {
      const msg = "Введите номер: только цифры, + и скобки (не менее 9 цифр)";
      setPhoneError(msg);
      setFormStatus("error");
      setFormMessage(msg);
      return;
    }
    setPhoneError("");
    setFormStatus("idle");
    setFormMessage("");

    setSubmitting(true);
    try {
      await submitLead({
        name: name.trim(),
        phone: phone.trim(),
        carName,
        kind,
      });

      const successText = "Заявка успешно отправлена";
      const successDetail = `Мы свяжемся с вами в ближайшее время по поводу ${carName}.`;

      setFormStatus("success");
      setFormMessage(successDetail);
      toast.success(successText, { description: successDetail, duration: 5000 });

      window.setTimeout(() => {
        setOpen(false);
        resetForm();
      }, 1800);
    } catch {
      const errorText = "Не удалось отправить заявку";
      const errorDetail =
        "Проверьте соединение и попробуйте ещё раз или позвоните нам по телефону в шапке сайта.";

      setFormStatus("error");
      setFormMessage(errorDetail);
      toast.error(errorText, { description: errorDetail, duration: 6000 });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          {formStatus === "success" && (
            <div
              role="status"
              className="rounded-lg border border-primary/40 bg-primary/10 px-4 py-3 text-sm text-gold"
            >
              <p className="font-medium">Заявка успешно отправлена</p>
              <p className="mt-1 text-muted-foreground">{formMessage}</p>
            </div>
          )}
          {formStatus === "error" && formMessage && (
            <div
              role="alert"
              className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
            >
              <p className="font-medium">Заявка не отправлена</p>
              <p className="mt-1 opacity-90">{formMessage}</p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor={`${formId}-name`}>Имя</Label>
            <Input
              id={`${formId}-name`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Иван"
              required
              disabled={submitting || formStatus === "success"}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${formId}-phone`}>Телефон</Label>
            <Input
              id={`${formId}-phone`}
              value={phone}
              onChange={(e) => {
                setPhone(sanitizePhoneInput(e.target.value));
                if (phoneError) setPhoneError("");
                if (formStatus === "error") {
                  setFormStatus("idle");
                  setFormMessage("");
                }
              }}
              onBlur={() => {
                if (phone && !isPhoneValid(phone)) {
                  setPhoneError("Введите номер: только цифры, + и скобки (не менее 9 цифр)");
                }
              }}
              placeholder="+375(29)0000000"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              pattern="[0-9+()]*"
              title="Только цифры, знак + и скобки"
              aria-invalid={!!phoneError}
              aria-describedby={phoneError ? `${formId}-phone-error` : undefined}
              required
              disabled={submitting || formStatus === "success"}
            />
            {phoneError && (
              <p id={`${formId}-phone-error`} className="text-xs text-destructive">
                {phoneError}
              </p>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Автомобиль: <span className="font-medium text-foreground">{carName}</span>
          </p>
          <Button
            type="submit"
            className="w-full"
            disabled={submitting || formStatus === "success"}
          >
            {submitting ? "Отправка…" : formStatus === "success" ? "Отправлено" : "Отправить заявку"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
