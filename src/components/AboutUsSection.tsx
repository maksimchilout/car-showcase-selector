const ABOUT_IMAGE = "/23ee694e-bbb8-4f5f-84a0-ee8b83ed221a.jpg";

const REASONS = [
  {
    title: "Заводская гарантия",
    text: "Все автомобили имеют официальную гарантию завода-изготовителя — 3 года или 100 000 км пробега.",
  },
  {
    title: "Качество сборки",
    text: "Мы предлагаем автомобили французской марки, собранные в Беларуси. Контроль качества на производстве осуществляется группой представителей концерна Stellantis (Peugeot-Citroen).",
  },
  {
    title: "Прозрачность происхождения",
    text: "Автомобили поставляются в виде машинокомплектов с завода DPCA (Китай), а 30% всех комплектующих имеют французское происхождение.",
  },
  {
    title: "Надёжность",
    text: "Как владельцы бренда electro-car.by, мы гарантируем высокий уровень сервиса и ответственный подход к каждому клиенту.",
  },
] as const;

export function AboutUsSection() {
  return (
    <section className="container mx-auto px-6 py-32">
      <div className="reveal mb-12 text-center">
        <div className="eyebrow">— О нас —</div>
        <h2 className="mt-4 font-serif text-4xl tracking-tight md:text-5xl">
          Официальный дилер <span className="italic text-gold">CITROËN</span> в Беларуси
        </h2>
      </div>

      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="reveal glass rounded-2xl p-8 md:p-10" style={{ transitionDelay: "80ms" }}>
          <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
            Компания ООО «ЯАР Групп» (владелец бренда electro-car.by) работает на автомобильном
            рынке Республики Беларусь с 2020 года. Сегодня мы являемся официальным дилером
            легендарной французской марки CITROËN.
          </p>

          <h3 className="mt-8 font-serif text-2xl tracking-wide">Почему стоит выбрать нас?</h3>

          <ul className="mt-6 space-y-5">
            {REASONS.map((item) => (
              <li key={item.title} className="flex gap-4">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" aria-hidden />
                <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                  <span className="font-medium text-foreground">{item.title}:</span> {item.text}
                </p>
              </li>
            ))}
          </ul>

          <p className="mt-8 text-sm leading-relaxed text-muted-foreground md:text-base">
            ООО «ЯАР Групп» — это сочетание европейского качества, локальной сборки и официального
            статуса. Доверьтесь профессионалам!
          </p>
        </div>

        <div
          className="reveal glass overflow-hidden rounded-2xl"
          style={{ transitionDelay: "160ms" }}
        >
          <img
            src={ABOUT_IMAGE}
            alt="Официальный дилер Citroën в Беларуси — ООО ЯАР Групп"
            className="aspect-[4/3] h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
