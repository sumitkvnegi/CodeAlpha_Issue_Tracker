/* eslint-disable react/prop-types */
import { useRef, useState } from "react";
import tw from "tailwind-styled-components";
import { HiFlag } from "react-icons/hi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdDelete, MdEditSquare, MdFileDownload, MdDateRange } from "react-icons/md";
import { BiSolidPieChart, BiSolidHourglassTop, BiSolidHourglassBottom } from "react-icons/bi";
import { deleteIssueData, fetchAllIssueData } from "../utils/api";
import { addData } from "../store/issueSlice";
import { useDispatch } from "react-redux";

const IssueCard = ({ issue }) => {
  const { title, description, priority, createdAt, data, file, _id, currentProject } = issue;
  const [showDropdown, setShowDropdown] = useState(false);
  const [editActive, setEditActive] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newStatus, setNewStatus] = useState("Open");
  const [newPriority, setNewPriority] = useState("Low");
  const fileInputRef = useRef(null);
  const [newFile, setNewFile] = useState(null);
  const [fileName, setFileName] = useState("No File Choose");
  const dispatch = useDispatch();

  const handleDownload = (base64Data, fileName, fileType) => {
    // Decode the base64 data to binary
    const binaryData = atob(base64Data);

    // Create a Uint8Array from the binary data
    const arrayBuffer = new Uint8Array(binaryData.length);
    for (let i = 0; i < binaryData.length; i++) {
      arrayBuffer[i] = binaryData.charCodeAt(i);
    }

    // Determine the MIME type based on the file type
    const mimeType = fileType === "pdf" ? "application/pdf" : "image/jpeg";

    // Convert the binary data to a Blob
    const blob = new Blob([arrayBuffer], { type: mimeType });

    // Create a link element
    const link = document.createElement("a");

    // Set the href attribute of the link to the Blob
    link.href = window.URL.createObjectURL(blob);

    // Set the download attribute with the desired file name
    link.download = fileName;

    // Append the link to the document
    document.body.appendChild(link);

    // Trigger a click on the link to start the download
    link.click();

    // Remove the link from the document
    document.body.removeChild(link);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    console.log(selectedFile);
    if (selectedFile) {
        setFileName(selectedFile.name);
        setNewFile(selectedFile);
    }
};


  const handleStatusChange = (val) => {
    setNewStatus(val);
}

const handlePriorityChange = (val) => {
    setNewPriority(val);
}

const handleButtonCLick = async () => {
  const formData = new FormData();

  if (file) {
    formData.append('file', newFile);
  }

  // Function to append field to FormData only if it is truthy
  const appendIfTruthy = (key, value) => {
    if (value) {
      formData.append(key, value);
    }
  };

  // Append only the changed fields to FormData
  appendIfTruthy('currentProject', currentProject);
  appendIfTruthy('title', newTitle);
  appendIfTruthy('description', newDescription);
  appendIfTruthy('status', newStatus);
  appendIfTruthy('priority', newPriority);

  try {
    const response = await fetch(`http://localhost:3000/api/issue/${_id}`, {
      method: 'PUT',
      body: formData,
    });

    if (response.ok) {
      console.log('File uploaded successfully');
      fetchAllIssueData().then((res) => {
        console.log(res);
        dispatch(addData(res));
      });
    } else {
      console.error('Error uploading file');
    }
  } catch (error) {
    console.error('Error uploading file', error);
  }

  // Reset only the changed fields
  setNewFile(null);
  setNewStatus("Open");
  setNewPriority("Low");
  setNewTitle("");
  setNewDescription("");
  setFileName("No File Choose");
  setEditActive(!editActive);
};


  const handleDelete = (id) => {
    deleteIssueData(id).then((res) => {
      console.log(res);
      fetchAllIssueData().then((res) => {
        console.log(res);
        dispatch(addData(res));
      })
    });
  };

  return (
    <Issue>
      <IssueContent
        className={`${priority === "High"
          ? "border-l-[#d94841]"
          : priority === "Medium"
            ? "border-l-[#d9b641]"
            : "border-l-[#83bf6e]"
          }`}
      >
        <IssueTitle>
          <span
            className={`flex items-center  gap-1 cursor-pointer ${priority === "High"
              ? "text-[#d94841]"
              : priority === "Medium"
                ? "text-[#d9b641]"
                : "text-[#83bf6e]"
              } rounded-full text-sm`}
          >
            <HiFlag /> {editActive ? (<input type="text" value={newTitle} placeholder={title} onChange={(e) => setNewTitle(e.target.value)} className="text-green-400 focus:outline-none placeholder:blur-[1px] placeholder:text-red-600 text-sm capitalize" />) : (<p className="text-black text-sm">{title}</p>)}
          </span>{" "}
          <BsThreeDotsVertical
            className="cursor-pointer text-sm"
            onClick={() => setShowDropdown(!showDropdown)}
          />
          {showDropdown && (
            <DropdownMenu>
              {file && (
                <DropdownItem onClick={() => handleDownload(data, file.filename, file.contentType)}>
                  <MdFileDownload title="Download" />
                </DropdownItem>
              )}
              <DropdownItem onClick={() => {
                setEditActive(!editActive);
                setNewTitle("");
              }}>
                <MdEditSquare title="Edit" />
              </DropdownItem>
              <DropdownItem onClick={() => handleDelete(_id)}>
                <MdDelete title="Delete" />
              </DropdownItem>
            </DropdownMenu>
          )}
        </IssueTitle>
        {editActive ? (<>
          <div className="absolute -bottom-36 left-1/5 bg-white p-2 flex flex-col rounded-md shadow-md">
            <Select>
              <List className='gap-1'>
                <Option className={`${newStatus == "Open" ? "bg-[#57b6f0] bg-opacity-20 p-1 rounded-full" : "p-1 rounded-full"}`} onClick={() => handleStatusChange("Open")} title='Open'> <div className="primaryBlue p-[3px] rounded-full text-white text-[6px] cursor-pointer"><BiSolidHourglassBottom /> </div> </Option>
                <Option className={`${newStatus == "In Progress" ? "bg-[#57b6f0] bg-opacity-20 p-1 rounded-full" : "p-1 rounded-full"}`} onClick={() => handleStatusChange("In Progress")} title='In Progress'> <div className="text-[#d94841] text-xs cursor-pointer"><BiSolidPieChart /> </div> </Option>
                <Option className={`${newStatus == "Close" ? "bg-[#57b6f0] bg-opacity-20 p-1 rounded-full" : "p-1 rounded-full"}`} onClick={() => handleStatusChange("Close")} title='Close'> <div className='bg-[#83bf6e] p-[3px] rounded-full text-white text-[6px] cursor-pointer'><BiSolidHourglassTop /> </div> </Option>
              </List>
              <List className='gap-1'>
                <Option className={`${newPriority == "Low" ? "bg-[#57b6f0] bg-opacity-20 p-1 rounded-full" : "p-1 rounded-full"}`} onClick={() => handlePriorityChange("Low")} title='Low'><div className='cursor-pointer text-[#83bf6e] rounded-full text-xs'><HiFlag /></div></Option>
                <Option className={`${newPriority == "Medium" ? "bg-[#57b6f0] bg-opacity-20 p-1 rounded-full" : "p-1 rounded-full"}`} onClick={() => handlePriorityChange("Medium")} title='Medium'><div className='cursor-pointer text-[#d9b641] rounded-full text-xs'><HiFlag /></div></Option>
                <Option className={`${newPriority == "High" ? "bg-[#57b6f0] bg-opacity-20 p-1 rounded-full" : "p-1 rounded-full"}`} onClick={() => handlePriorityChange("High")} title='High'><div className='cursor-pointer text-[#d94841] rounded-full text-xs'><HiFlag /></div></Option>
              </List>
              </Select>

            <File
              onClick={() => fileInputRef.current.click()}><span>Upload File</span> <p className='text-center text-[0.6rem] font-semibold bg-white py-1 px-2 rounded-sm text-[#666]'>{fileName}</p></File>
            <input ref={fileInputRef} onChange={handleFileChange} className='hidden' type="file" name="attachment" />
            <button onClick={handleButtonCLick} className="text-xs mx-auto p-2 gradientGreen text-white rounded-md border-2 mt-2">Update Changes</button>
            </div>
            <textarea value={newDescription} placeholder={description} onChange={(e) => setNewDescription(e.target.value)} className="text-green-400 focus:outline-none placeholder:blur-[1px] placeholder:text-red-600  text-sm text-center tracking-wide truncate placeholder:font-thin resize-none" /></>) : (<Desc>{description}</Desc>)}

        <div className="flex justify-between items-center">
          <p className="flex items-end gap-1 rounded-md text-xs text-[#999]">
            <MdDateRange size={16} />{" "}
            {new Date(createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
          <p> </p>
        </div>
      </IssueContent>
    </Issue>
  );
};

const Issue = tw.li`h-fit flex flex-col gap-2 mb-4`;
const IssueTitle = tw.div`title font-semibold text-md tracking-wide border-b-2 pb-2 border-[#1111] flex items-center gap-1 justify-between capitalize relative`;
const Desc = tw.p`text-sm text-center tracking-wide truncate font-medium py-2 text-[#666]`;
const IssueContent = tw.div`flex flex-col gap-3 border-l-4 bg-white py-2 px-3 rounded-md shadow-md relative`;

const DropdownMenu = tw.div`absolute top-full -right-1 flex gap-1 items-center flex-col mt-1`;
const DropdownItem = tw.div`p-1 cursor-pointer flex items-center gap-2 hover:bg-gray-100 text-sm bg-white border rounded-full shadow-md`;
const Select = tw.div`flex justify-center gap-4 items-center`;
const List = tw.ul`flex gap-1 items-center`;
const Option = tw.li``;
const File = tw.button`text-[0.6rem] tracking-wide font-semibold blue rounded-md p-2 bg-[#57b6f0] bg-opacity-10 shadow-sm flex gap-2 items-center mx-auto mt-2`;

export default IssueCard;
