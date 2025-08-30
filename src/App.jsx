import React, { useEffect, useMemo, useRef, useState } from 'react'

const DEADLINE = new Date('2025-09-09T23:59:59+05:00').getTime()

function useCountdown() {
  const [now, setNow] = useState(Date.now())
  useEffect(()=>{
    const id = setInterval(()=> setNow(Date.now()), 1000)
    return ()=>clearInterval(id)
  }, [])
  const diff = Math.max(0, DEADLINE - now)
  const d = Math.floor(diff / (1000*60*60*24))
  const h = Math.floor(diff / (1000*60*60)) % 24
  const m = Math.floor(diff / (1000*60)) % 60
  const s = Math.floor(diff / 1000) % 60
  const text = `${String(d).padStart(2,'0')}д ${String(h).padStart(2,'0')}ч ${String(m).padStart(2,'0')}м ${String(s).padStart(2,'0')}с`
  return text
}

function Section({id, title, children}) {
  return (
    <article id={id} data-title={title} className="bg-white rounded-2xl p-5 shadow-sm scroll-mt-24">
      <h2 className="font-extrabold text-xl mb-3">{title}</h2>
      {children}
    </article>
  )
}

function Lightbox({src, onClose}){
  if(!src) return null
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <button className="absolute top-4 right-4 bg-white/90 rounded-xl px-3 py-1" onClick={onClose}>Закрыть</button>
      <img src={src} className="max-h-[90vh] max-w-[90vw] rounded-xl shadow-2xl" />
    </div>
  )
}

export default function App() {
  const countdown = useCountdown()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [lightbox, setLightbox] = useState(null)
  const containerRef = useRef(null)

  const sections = useMemo(()=>[
    {id:'requirements', title:'Требования к проекту'},
    {id:'gallery', title:'Примеры необычной навигации'},
    {id:'register', title:'Register'},
    {id:'login', title:'Login'},
    {id:'profile', title:'UserProfile'},
    {id:'contacts', title:'Contacts (iframe)'},
    {id:'components', title:'Компоненты и анимации'},
    {id:'grid', title:'Сетки и адаптив'},
    {id:'git', title:'GIT & Vercel'},
    {id:'about', title:'Об авторе'},
  ], [])

  
  useEffect(()=>{
    const handler = (e)=>{
      const hash = location.hash?.slice(1)
      const idx = Math.max(0, sections.findIndex(s => s.id === hash))
      if (['ArrowDown','PageDown','ArrowRight'].includes(e.key)) {
        e.preventDefault()
        const target = sections[idx + 1] ?? sections[sections.length-1]
        document.getElementById(target.id)?.scrollIntoView({behavior:'smooth'})
      }
      if (['ArrowUp','PageUp','ArrowLeft'].includes(e.key)) {
        e.preventDefault()
        const target = sections[idx - 1] ?? sections[0]
        document.getElementById(target.id)?.scrollIntoView({behavior:'smooth'})
      }
    }
    window.addEventListener('keydown', handler)
    return ()=> window.removeEventListener('keydown', handler)
  }, [sections])


  const [progress, setProgress] = useState(0)
  useEffect(()=>{
    const els = sections.map(s=>document.getElementById(s.id)).filter(Boolean)
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          const idx = els.indexOf(e.target) + 1
          setProgress(Math.round(idx/els.length * 100))
          history.replaceState(null,'',`#${e.target.id}`)
        }
      })
    }, {threshold:.6})
    els.forEach(el=>io.observe(el))
    return ()=> io.disconnect()
  }, [sections])

  return (
    <>
     
      <div className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-2 flex items-center justify-between">
          <p className="text-sm md:text-base font-semibold">
            Дедлайн: <span className="underline underline-offset-4">09.09.2025</span>
          </p>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-sm opacity-70">До дедлайна:</span>
            <span className="font-extrabold tabular-nums">{countdown}</span>
          </div>
        </div>
      </div>

   
      <header className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-black/90"></div>
            <div>
              <h1 className="font-extrabold text-2xl">Финальный проект: требования и примеры</h1>
              <p className="text-sm text-slate-500">Автор: <b>Джетиберген Мадияр (icdfh)</b> · Группа <b>Front-end52</b></p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-2">
            {sections.map(s=>(
              <button key={s.id} onClick={()=>document.getElementById(s.id)?.scrollIntoView({behavior:'smooth'})}
                className="px-3 py-2 rounded-xl border hover:bg-slate-50 active:scale-95">{s.title}</button>
            ))}
          </nav>
          <button className="md:hidden px-3 py-2 rounded-xl border" onClick={()=>setMobileOpen(v=>!v)}>Меню</button>
        </div>
        {mobileOpen && (
          <div className="md:hidden border-t bg-white">
            <div className="max-w-7xl mx-auto px-4 py-3 grid grid-cols-2 gap-2">
              {sections.map(s=>(
                <button key={s.id}
                  onClick={()=>{document.getElementById(s.id)?.scrollIntoView({behavior:'smooth'}); setMobileOpen(false)}}
                  className="px-3 py-2 rounded-xl border text-left">{s.title}</button>
              ))}
            </div>
          </div>
        )}
      </header>

     
      <main className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6 px-4 py-6">
      
        <aside className="sticky top-24 h-[calc(100dvh-96px)] hidden md:flex flex-col gap-3 pr-2 border-r">
          <div className="p-3 bg-white rounded-2xl shadow-sm">
            <p className="text-xs text-slate-500 mb-2">Навигация:</p>
            <ul className="space-y-1 text-sm">
              {sections.map((s, i)=>(
                <li key={s.id}>
                  <button className="w-full text-left px-3 py-2 rounded-lg border hover:bg-slate-50 active:scale-95"
                    onClick={()=>document.getElementById(s.id)?.scrollIntoView({behavior:'smooth'})}>
                    {i+1}. {s.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="p-3 bg-white rounded-2xl shadow-sm">
            <p className="text-xs text-slate-500 mb-2">Прогресс</p>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div className="h-2 bg-slate-900 rounded-full" style={{width:`${progress}%`}} />
            </div>
          </div>
        </aside>

       
        <section ref={containerRef} className="space-y-8">
          <Section id="requirements" title="Требования к финальному проекту">
            <ul className="grid gap-2">
              <li>Минимум <b>10 страниц</b> (в этом демо — 10 секций).</li>
              <li><b>Необычная навигация</b> (сайдбар, клавиши, прогресс, модальные примеры).</li>
              <li>Тема <b>свободная</b>.</li>
              <li>Стэк: <b>HTML + CSS</b>, <b>Tailwind CDN</b>, <b>SCSS</b> (переменные/миксины/нестинг).</li>
              <li>Семантика: header/main/nav/section/article/figure/footer, корректный &lt;title&gt; и favicon.</li>
              <li>Адаптив: сетки, мобильное меню, удобный UX.</li>
              <li>Анимации: :hover/:focus/:active + transition/transform + keyframes.</li>
              <li>Формы: <b>REGISTER</b>, <b>LOGIN</b>, <b>UserProfile</b>.</li>
              <li>Контакты: <b>iframe</b> видео и карта.</li>
              <li>GIT + VERCEL — <b>обязательно</b>.</li>
            </ul>
            <div className="mt-4 p-3 rounded-xl bg-yellow-50 border border-yellow-200">
              <b>Дедлайн:</b> сдать до <u>09.09.2025</u>. Приложить ссылку на Vercel и публичный репозиторий.
            </div>
          </Section>

          <Section id="gallery" title="Примеры необычной навигации">
            <p className="text-sm text-slate-500 mb-4">Клик по изображению — откроется на весь экран.</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {['/assets/ui-1.png','/assets/ui-2.png','/assets/ui-3.png','/assets/ui-4.png'].map((src,i)=>(
                <figure key={src} className="bg-white border rounded-xl p-2">
                  <img src={src} className="w-full rounded-lg cursor-zoom-in" onClick={()=>setLightbox(src)} />
                  <figcaption className="text-xs text-slate-500 mt-2">Пример {i+1}</figcaption>
                </figure>
              ))}
            </div>
          </Section>

          <Section id="register" title="Register">
            <form className="grid gap-3 max-w-md" noValidate>
              <label className="grid gap-1">
                <span className="text-sm text-slate-600">Имя</span>
                <input className="px-3 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-slate-900"
                       required placeholder="Иван" />
              </label>
              <label className="grid gap-1">
                <span className="text-sm text-slate-600">Email</span>
                <input type="email" required placeholder="name@email.com"
                       className="px-3 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-slate-900" />
              </label>
              <label className="grid gap-1">
                <span className="text-sm text-slate-600">Пароль</span>
                <input type="password" minLength={6} required placeholder="••••••••"
                       className="px-3 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-slate-900" />
              </label>
              <button className="px-4 py-2 rounded-xl border bg-black text-white hover:bg-black/90 active:scale-95">Создать аккаунт</button>
            </form>
          </Section>

          <Section id="login" title="Login">
            <form className="grid gap-3 max-w-md" noValidate>
              <label className="grid gap-1">
                <span className="text-sm text-slate-600">Email</span>
                <input type="email" required placeholder="name@email.com"
                       className="px-3 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-slate-900" />
              </label>
              <label className="grid gap-1">
                <span className="text-sm text-slate-600">Пароль</span>
                <input type="password" minLength={6} required placeholder="••••••••"
                       className="px-3 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-slate-900" />
              </label>
              <button className="px-4 py-2 rounded-xl border bg-black text-white hover:bg-black/90 active:scale-95">Войти</button>
            </form>
          </Section>

          <Section id="profile" title="UserProfile">
            <form className="grid gap-3 max-w-md" noValidate>
              <label className="grid gap-1">
                <span className="text-sm text-slate-600">Никнейм</span>
                <input required placeholder="icdfh"
                       className="px-3 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-slate-900" />
              </label>
              <label className="grid gap-1">
                <span className="text-sm text-slate-600">Аватар (URL)</span>
                <input type="url" placeholder="https://.../avatar.png"
                       className="px-3 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-slate-900" />
              </label>
              <label className="grid gap-1">
                <span className="text-sm text-slate-600">О себе</span>
                <textarea rows="4" placeholder="Коротко о себе..."
                       className="px-3 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-slate-900" />
              </label>
              <button className="px-4 py-2 rounded-xl border bg-black text-white hover:bg-black/90 active:scale-95">Сохранить</button>
            </form>
          </Section>

          <Section id="contacts" title="Contacts (iframe)">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="relative pb-[56.25%]">
                <iframe className="absolute inset-0 w-full h-full rounded-xl border" src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="Видео" loading="lazy" allowFullScreen />
              </div>
              <div className="relative pb-[56.25%]">
                <iframe className="absolute inset-0 w-full h-full rounded-xl border" src="https://www.openstreetmap.org/export/embed.html?bbox=76.88,43.21,76.92,43.24&layer=mapnik" title="Карта" loading="lazy" />
              </div>
            </div>
            <p className="text-sm text-slate-500 mt-3">Видео и карта — обязательное требование: используйте &lt;iframe&gt;.</p>
          </Section>

          <Section id="components" title="Компоненты и анимации">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {['Hover','Focus','Active','Pulse','Bounce','Spin'].map((t,i)=>(
                <button key={t} className={"px-6 py-10 rounded-2xl border font-bold " + (t==='Pulse'?'animate-pulse ': t==='Bounce'?'animate-bounce ':'')}>
                  {t}
                </button>
              ))}
            </div>
            <p className="text-sm text-slate-500 mt-3">Используйте псевдоклассы и @keyframes. Добавьте собственные анимации.</p>
          </Section>

          <Section id="grid" title="Сетки и адаптив">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {Array.from({length:6}).map((_,i)=>(
                <div key={i} className="px-4 py-10 rounded-2xl border text-center font-extrabold">{i+1}</div>
              ))}
            </div>
            <p className="text-sm text-slate-500 mt-3">Грид адаптируется на брейкпоинтах. Стили — в SCSS.</p>
          </Section>

          <Section id="git" title="GIT & Vercel">
            <ol className="list-decimal pl-5 space-y-1">
              <li>Инициализируй репозиторий: <code>git init && git add . && git commit -m "init"</code></li>
              <li>Опубликуй на GitHub (Public).</li>
              <li>Задеплой на <b>Vercel</b> (Framework preset: <i>Vite</i>).</li>
              <li>В README добавь ссылку на Vercel и чек-лист соответствия ТЗ.</li>
            </ol>
          </Section>

          <Section id="about" title="Об авторе">
            <p>Демо-сайт подготовлен: <b>Джетиберген Мадияр (icdfh)</b>, группа <b>Front-end52</b></p>
          </Section>
        </section>
      </main>

      <footer className="mt-6 border-t">
        <div className="mx-auto max-w-7xl px-4 py-8 text-sm text-slate-500">
          <p>© 2025 Джетиберген Мадияр (icdfh)</p>
        </div>
      </footer>

      <Lightbox src={lightbox} onClose={()=>setLightbox(null)} />
    </>
  )
}
