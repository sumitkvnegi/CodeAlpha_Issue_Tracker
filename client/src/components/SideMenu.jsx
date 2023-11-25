import { useEffect, useState } from "react";
import AnimationHOC from "./AnimationHOC";
import tw from 'tailwind-styled-components';
import { FaChevronDown } from "react-icons/fa"
import AddIssue from "./AddIssue"
import { useDispatch } from "react-redux";
import { addName } from "../store/currentProjectSlice";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineCloseFullscreen } from "react-icons/md";
import { createProjectName, fetchProjectNames } from "../utils/api";

const SideMenu = () => {
  const [currentProject, setCurrentProject] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectNames, setProjectNames] = useState(null);
  const [toggle, setToggle] = useState(false);
  const dispatch = useDispatch();

  const [confirmBox, setConfirmBox] = useState(false);
  const [confirmName, setConfirmName] = useState("");
  const [name, setName] = useState("");
  const [reload, setReload] = useState(false);

  const handleProjectName = async () => {
    try {
      if (projectName.length > 0) {
        console.log(projectName);
        await createProjectName(projectName.trim());
        setReload(!reload); // Trigger reload after creating a new project name
        setProjectName(""); // Clear the input field after creating a project
      }
    } catch (error) {
      console.error(error);
    }
  };

  const confirmDelete = (name) => {
    setConfirmBox(!confirmBox);
    setConfirmName(name);
  };

  const deleteProjectName = async (nameToDelete) => {
    try {
      const response = await fetch(`http://localhost:3000/api/project/${nameToDelete}`, {method: "DELETE"});
      
      if (!response.ok) {
        throw new Error(`Failed to delete project name: ${response.statusText}`);
      }
  
      const responseData = await response.json();
      console.log(responseData.message);
      setCurrentProject("");
      setName("");
      setConfirmName("");
      setReload(!reload); 
      setConfirmBox(!confirmBox);
    } catch (error) {
      console.error(error.message);
    }
  };

  const fetchProjectData = async () => {
    try {
      const data = await fetchProjectNames();
      setProjectNames(data[data.length - 1].projectnames);
    } catch (error) {
      console.log('Error fetching project names:', error);
    }
  };

  useEffect(() => {
    fetchProjectData();
  }, [reload]);

  return (
    <Container>
      {/* project name list */}
      <ProjectName onClick={() => setToggle(!toggle)}>
        <div>
          <p>{currentProject.length <= 0 ? "Select Project Name" : currentProject}</p>
          <p className="font-normal text-xs">Clients Projects</p>
        </div>
        <button className="hover:animate-pulse font-thin -translate-y-1"><FaChevronDown /></button>
      </ProjectName>

      {toggle && (<ProjectList>
        <div className="flex items-center justify-between px-1">
          <input type="text" placeholder="Project Name" value={projectName} onChange={(e) => setProjectName(e.target.value)} className="bg-[#6a7185] bg-opacity-5 placeholder:text-[#999] placeholder:font-semibold text-lg tracking-wide p-2 rounded-l-md shadow-inner focus:outline-none w-[90%]" />
          <button onClick={() => {
            handleProjectName();
            setProjectName("");
            fetch()
          }} className="text-xl font-bold w-[20%] gradientBlue text-white p-2 text-center rounded-r-md">+</button>
        </div>
        {projectNames && projectNames.map((name) => (
          <ProjectListName key={name} onClick={() => {
            dispatch(addName(name));
            setToggle(!toggle);
            setCurrentProject(name);
            setReload(!reload);
          }
          }>{name} <button className="text-2xl font-bold w-[20%] text-white p-1 text-center bg-red-500 rounded-md" onClick={() => confirmDelete(name)}>-</button></ProjectListName>
        ))}
      </ProjectList>)}
      {confirmBox && <div className="bg-black bg-opacity-80 w-full h-full absolute left-0 top-0  "><div className="flex w-full h-fit justify-center items-center gap-1 py-10 "><input className="`bg-[#6a7185] bg-opacity-5 placeholder:text-[#999] placeholder:font-semibold text-xs p-3 rounded-sm shadow-inner focus:outline-none`
" type="text" name="confirm name" placeholder={"Enter: '" + confirmName + "'"} value={name} onChange={(e) => setName(e.target.value)} autoComplete="off" /><button className="text-lg font-bold text-white p-3 text-center bg-red-500 rounded-sm" onClick={() => {
          console.log("out")
          if (name == confirmName) {
            console.log("in")
            deleteProjectName(name);
            console.log(name)
          } else {
            setConfirmBox(!confirmBox)
          }
        }}><RiDeleteBin6Line /></button>
        <button className="text-lg font-bold text-white text-center bg-green-500 rounded-sm p-3" onClick={() => {
          setConfirmBox(!confirmBox);
        }}><MdOutlineCloseFullscreen /></button></div></div>}
      {
        !toggle &&
        <AddIssue currentProject={currentProject} />
      }

      {/* 
          <h2 className="py-3 px-4">Team Members</h2>
          <ul className="my-4">
            <li className="flex py-3 px-4 gap-2 text-sm font-medium items-center rounded-md  shadow-lg"><div className="w-10 h-10 bg-gray-200 rounded-full"></div> <div><p>Sumit Negi</p></div></li>
            <li className="flex py-3 px-4 gap-2 text-sm font-medium items-center rounded-md  shadow-lg"><div className="w-10 h-10 bg-gray-200 rounded-full"></div> <div><p>Saloni Sundli</p></div></li>
            <li className="flex py-3 px-4 gap-2 text-sm font-medium items-center rounded-md  shadow-lg"><div className="w-10 h-10 bg-gray-200 rounded-full"></div> <div><p>Narender Modi</p></div></li>
          </ul> */}
    </Container>
  )
}

const Container = tw.div`flex w-[25vw] flex-col bg-white title p-4 h-screen shadow-lg shadow-[#1114] relative`;
const ProjectName = tw.div`text-md blue tracking-wider font-bold bg-[#57b6f0] bg-opacity-10 px-4 py-3 rounded-md flex justify-between items-center w-full gap-4 border-b-2 mb-1 border-l-4 border-l-[#d94841] capitalize`;
const ProjectList = tw.ul`rounded-lg bg-[#57b6f0] bg-opacity-5 p-2 flex flex-col gap-2`;
const ProjectListName = tw.li`text-sm title tracking-wider font-medium pl-4 pr-1 py-3 ease-in duration-150 rounded-md bg-white cursor-pointer shadow-md hover:shadow-sm flex justify-between items-center capitalize`

const EnhancedSideMenu = AnimationHOC(SideMenu);

export default EnhancedSideMenu;