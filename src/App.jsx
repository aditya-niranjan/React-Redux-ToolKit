
// import { PhotoFetcher } from './api/mediaApi'
import { SearchBar } from './components/SearchBar'
import Tabs from './components/Tabs'

const App = () => {
  return (
   <div className='w-full h-screen text-white bg-gray-950' >
    <SearchBar/>
    <Tabs/>
   </div>
  )
}

export default App