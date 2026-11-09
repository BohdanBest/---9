import React from 'react';
import { Sparkles, Calendar, Mic, Award, Compass, Heart } from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const timelineEvents = [
    {
      year: '2020 — 2021',
      title: 'Народження Lely45 та перший прорив',
      badge: 'Дебют & Вірусність',
      icon: <Mic size={20} color="#e5b36a" />,
      text: 'Людмила Білоусова, маючи театральну освіту, починає публікувати щирі, дещо бунтарські акустичні уривки власних пісень у TikTok. Трек «Вісім» та сингл «Спробуй купи мене» миттєво підривають алгоритми соцмереж. Випуск дебютного альбому «Дівчинка на дискотеці» закріплює за нею статус одного з найсвіжіших голосів нової хвилі української музики.',
    },
    {
      year: '2022',
      title: 'Музика під сиренами та воєнний щоденник',
      badge: 'Незламність',
      icon: <Heart size={20} color="#c84343" />,
      text: 'Повномасштабне російське вторгнення кардинально змінило інтонації. Замість юнацької легкості з’являється біль, пронизливість і боротьба. Співачка презентує платівку «Коли сонце сідає за схил» та реліз «Слухай моє серце». Пісні «Поруч з тобою» та «Моя душа» стають саундтреком підтримки для мільйонів українців у сховищах, на фронті та в евакуації.',
    },
    {
      year: '2023',
      title: 'Рок-маніфест «Всі дівчата хороші»',
      badge: 'Еволюція стилю',
      icon: <Award size={20} color="#e5b36a" />,
      text: 'Звучання набуває більш жорсткого гітарного гранж/інді-характеру. Альбом «Всі дівчата хороші» присвячений жіночій самобутності, боротьбі з нав’язаними стандартами та права бути незручною. Гурт проводить серію благодійних турів Україною та європейськими містами, спрямовуючи всі доходи на потреби захисників України.',
    },
    {
      year: '2024 — Сьогодні',
      title: 'Переродження: Lyuda Bielousova (LB)',
      badge: 'Нова ера',
      icon: <Compass size={20} color="#e5b36a" />,
      text: 'Артистка приймає сміливе рішення закрити сценічний псевдонім Lely45, пояснюючи це тим, що вона переросла юнацький образ і прагне максимальної автентичності без жодних масок. Під власним іменем Lyuda Bielousova виходить повноформатна платівка «РЕТРОспектива» та головний сингл «Переслідувати час». Це філософська, глибока і стилістично бездоганна робота дорослої авторки.',
    },
  ];

  return (
    <div className="history-page" style={{ padding: '3rem 0 6rem 0' }}>
      <div className="container">
        {/* Page Header */}
        <div style={{ maxWidth: '780px', marginBottom: '4rem' }}>
          <span className="section-tag">
            <Sparkles size={13} />
            Хроніка становлення
          </span>
          <h1 style={{ fontSize: '3rem', lineHeight: '1.15', marginBottom: '1.2rem' }}>
            ІСТОРІЯ ГУРТУ ТА ТВОРЧОГО ШЛЯХУ
          </h1>
          <p style={{ color: '#a1a1aa', fontSize: '1.1rem', lineHeight: '1.7' }}>
            Від перших акустичних записів у кімнаті гуртожитку до великих сцен і сміливого перезавантаження 
            під власним ім'ям <strong>Lyuda Bielousova</strong>.
          </p>
        </div>

        {/* Timeline Component */}
        <div style={{ position: 'relative', maxWidth: '850px', margin: '0 auto' }}>
          {/* Vertical Timeline Line */}
          <div
            style={{
              position: 'absolute',
              top: '10px',
              bottom: '10px',
              left: '24px',
              width: '2px',
              background: 'linear-gradient(to bottom, #e5b36a 20%, rgba(229, 179, 106, 0.1) 90%)',
            }}
          ></div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
            {timelineEvents.map((ev, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  gap: '2rem',
                  position: 'relative',
                  alignItems: 'flex-start',
                }}
              >
                {/* Node marker */}
                <div
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: '#14141c',
                    border: '2px solid #e5b36a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2,
                    boxShadow: '0 0 20px rgba(229, 179, 106, 0.25)',
                    flexShrink: 0,
                  }}
                >
                  {ev.icon}
                </div>

                {/* Content Box */}
                <div
                  style={{
                    background: 'rgba(22, 22, 28, 0.7)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    padding: '2rem',
                    flex: 1,
                    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.4)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '0.8rem',
                      marginBottom: '0.8rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#e5b36a', fontSize: '0.9rem', fontWeight: 700 }}>
                      <Calendar size={14} />
                      <span>{ev.year}</span>
                    </div>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        padding: '0.25rem 0.65rem',
                        background: 'rgba(255,255,255,0.06)',
                        borderRadius: '4px',
                        color: '#d1d1d6',
                      }}
                    >
                      {ev.badge}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '1rem' }}>
                    {ev.title}
                  </h3>

                  <p style={{ color: '#a1a1aa', lineHeight: '1.7', fontSize: '0.95rem' }}>
                    {ev.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

