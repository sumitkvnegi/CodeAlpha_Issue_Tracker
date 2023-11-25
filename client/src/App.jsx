import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./components/Home";
import Authenticate from "./components/Authenticate";
import tw from "tailwind-styled-components";
import Header from "./components/Header";
import { Provider } from "react-redux";
import store from "./store/store";

const App = () => {
  const appRouter = createBrowserRouter([{
    path: "/",
    element: <Home/>
  },
  {
    path: '/authenticate',
    element: <Authenticate/>
}]);

  return (<Provider store={store}>
      <Header/>
    <Wrapper>
      <RouterProvider router={appRouter} />
    </Wrapper>
    </Provider>
  )
};

const Wrapper = tw.main`bg-[#F5F7FA] text-[#ffffff] overflow-hidden flex w-screen`;

export default App

// 87 182 240 sky blue
// #4a86f7 primary blue
// #4a86f7 to #2448b1 gradient blue
// 3E70DC blue
// #83bf6e green 
// #73bc78 to #438a62 gradient green 
// #d94841 red
// #35353d title
// #6a7185 body
// #f5f7fa background
// #ffffff white

// font inter