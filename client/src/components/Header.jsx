import tw from "tailwind-styled-components";

const Header = () => {

  return (
    <Head>
        <h1 className="text-2xl font-bold">Issue Tracker</h1>
        <AddTaskButton>Login</AddTaskButton>
        </Head>
  )
}

const Head = tw.header`bg-white flex justify-between m-[2px] py-2 px-4 shadow-md shadow-[#1111] overflow-hidden`;

const AddTaskButton = tw.button`bg-gradient-to-r from-[#73bc78] to-[#438a62] text-white rounded-md px-3 py-2 text-md`;
export default Header