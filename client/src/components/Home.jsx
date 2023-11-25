import tw from "tailwind-styled-components";
import EnhancedSideMenu from "./SideMenu";
import { BiSolidPieChart, BiSolidHourglassTop, BiSolidHourglassBottom } from "react-icons/bi";
import IssueCard from "./IssueCard";

import { useSelector } from "react-redux";

const Home = () => {

  const data = useSelector((store)=>store.issue.data);
  const currentProjectName = useSelector((store)=>store.currentProject.name);

  return (
    <>
      <EnhancedSideMenu />
      <Container>
          <StatusWrapper>
            <Status>
              <StatusHead><div className="primaryBlue p-1 rounded-full text-white text-xs"><BiSolidHourglassTop /></div> Open</StatusHead>
              <Issues>
                {data && data.map((issue)=>(
                <div key={issue._id}>{issue.currentProject == currentProjectName && issue.status=="Open" && <IssueCard issue={issue}/>}</div>             
                ))}
              </Issues>
            </Status>
            <Status>
              <StatusHead><div className="text-[#d94841] text-xl"><BiSolidPieChart /></div> In Progress</StatusHead>
              <Issues>
              {data && data.map((issue)=>(
                <div key={issue._id}>{issue.currentProject == currentProjectName && issue.status=="In Progress" && <IssueCard issue={issue}/>}</div>             
                ))}
              </Issues>
            </Status>
            <Status>
              <StatusHead><div className="bg-[#83bf6e] p-1 rounded-full text-white text-xs"><BiSolidHourglassBottom /></div> Close</StatusHead>
              <Issues>
              {data && data.map((issue)=>(
                <div key={issue._id}>{issue.currentProject == currentProjectName && issue.status=="Close" && <IssueCard issue={issue}/>}</div>             
                ))}
              </Issues>
            </Status>
          </StatusWrapper>
      </Container>
    </>
  )
}

const Container = tw.section`text-black flex flex-col w-[75vw] h-full`;
const StatusWrapper = tw.div`grid grid-cols-3`
const StatusHead = tw.h1`bg-white title font-semibold px-4 py-2 rounded-xs shadow-md shadow-[#1111] flex items-center gap-2 m-[2px]`;
const Status = tw.div``;
const Issues = tw.ul`p-2 flex flex-col justify-start`

export default Home