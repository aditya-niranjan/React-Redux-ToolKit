import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setQuery } from '../Redux/Features/searchSlice';


export const SearchBar = () => {
  const [text, setText] = useState('')

  const dispatch = useDispatch();

  const SubmitHandler = (e) => {
    e.preventDefault();
    dispatch(setQuery(text));
    // console.log('Search submitted:', text);
    setText('');
  }

  return (
    <div className='w-full flex justify-center px-2 sm:px-4'>
      <form 
        onSubmit={(e)=>{
           SubmitHandler(e) }}
        className='
          w-full 
          max-w-5xl
          text-white 
          h-14 sm:h-13
          bg-[#b7b0b02e] 
          border-[#b9abab] 
          border 
          flex 
          items-center 
          rounded-b-3xl sm:rounded-b-4xl 
          justify-center 
          gap-3 sm:gap-4 
          px-2 sm:px-4
        ' 
      >
        <input
        autoComplete='off'
          value={text}
          onChange={(event)=>{ setText(event.target.value) }}
          required 
          type="text"  
          placeholder='Search anything..' 
          id="search"  
          className="

            text-white 
            border-[#89689e] 
            border-2 
            rounded-md 
            py-1.5 
            px-2 
            w-[60%] 
            sm:w-[70%] 
            md:w-[50%]
          "
        />
   
        <div className="shrink-0">
          <button 
            className='
            cursor-pointer
              text-white 
              border-[#0f380f]  
              bg-green-600 
              border-2 
              rounded-full 
              py-0.5 
              px-3 sm:px-6
              text-base sm:text-[20px]
              active:scale-90
              transition-all 
              duration-150
            '
          >
            Search
          </button>
        </div>
      </form>
    </div>
  )
}
