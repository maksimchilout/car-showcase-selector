import { Phone, MapPin, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container mx-auto grid gap-8 px-4 py-12 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 64 32" className="h-8 w-12 text-primary" fill="currentColor">
              <path d="M2 22 L18 6 L34 22 L29 22 L18 11 L7 22 Z" />
              <path d="M30 22 L46 6 L62 22 L57 22 L46 11 L35 22 Z" />
            </svg>
            <span className="text-lg font-bold">CITROËN</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Официальный представитель Citroën. Продажа, сервис и оригинальные запчасти.
          </p>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold">Контакты</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> +375 (29) 123-45-67</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> info@citroen.by</li>
            <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4" /> г. Минск, ул. Свердлова, 23/4-1</li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold">Время работы</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Пн–Пт: 9:00 – 20:00</li>
            <li>Сб–Вс: 10:00 – 18:00</li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold">Партнёры</h3>
          <p className="text-sm text-muted-foreground">
            Авторизованный дилер. Гарантия завода-изготовителя, лизинг и кредит от партнёрских банков.
          </p>
        </div>
      </div>
      <div className="border-t py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Citroën Беларусь. Все права защищены.
      </div>
    </footer>
  );
}
