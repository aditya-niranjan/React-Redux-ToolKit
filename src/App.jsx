import ResultGrid from './components/ResultGrid'
import { SearchBar } from './components/SearchBar'
import Tabs from './components/Tabs'

const App = () => {
  return (
   <div className='w-full px-4 min-h-screen text-white bg-gray-950'>
    <SearchBar/>
    <Tabs/>
    <ResultGrid/>
   </div>
  )
}

export default App