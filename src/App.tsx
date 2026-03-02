import { Routes, Route } from 'react-router-dom'
import Landing from '@/pages/Landing'
import Settings from '@/pages/Settings'
import Form from '@/pages/Form'

function App() {
  return (
    <div className="mx-auto max-w-md">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/form" element={<Form />} />
      </Routes>
    </div>
  )
}

export default App
