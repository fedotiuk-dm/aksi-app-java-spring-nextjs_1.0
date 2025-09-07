import React from 'react';
import GlitchTipTest from '@/components/test/GlitchTipTest';

export default function TestGlitchTipPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          🧪 GlitchTip Error Monitoring Test
        </h1>
        <p className="text-gray-600 max-w-2xl">
          Ця сторінка призначена для тестування функціональності GlitchTip. Всі помилки та події
          будуть відправлені до вашого GlitchTip сервера.
        </p>
      </div>

      <GlitchTipTest />

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-xl font-semibold text-blue-900 mb-2">📋 Як використовувати:</h2>
        <ol className="list-decimal list-inside text-blue-800 space-y-1">
          <li>Переконайтеся, що GlitchTip сервер запущений на порту 8000</li>
          <li>Натисніть &quot;Запустити всі тести&quot; для комплексного тестування</li>
          <li>Або використовуйте окремі кнопки для тестування конкретних функцій</li>
          <li>Перевірте GlitchTip dashboard для перегляду отриманих подій</li>
        </ol>
      </div>

      <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
        <h2 className="text-xl font-semibold text-yellow-900 mb-2">⚠️ Важливо:</h2>
        <ul className="list-disc list-inside text-yellow-800 space-y-1">
          <li>
            Тест &quot;Unhandled Error&quot; може зламати сторінку - це нормально для тестування
          </li>
          <li>Всі події відправляються до GlitchTip асинхронно</li>
          <li>Можливо знадобиться кілька секунд для появи подій у dashboard</li>
        </ul>
      </div>
    </div>
  );
}
