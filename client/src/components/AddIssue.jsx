/* eslint-disable react/prop-types */
import tw from 'tailwind-styled-components';
import { BiSolidPieChart, BiSolidHourglassTop, BiSolidHourglassBottom } from "react-icons/bi";
import { HiFlag } from "react-icons/hi";
import { useRef, useState } from 'react';
import { useEffect } from "react";
import { fetchAllIssueData } from "../utils/api";
import { addData } from "../store/issueSlice";
import { useDispatch } from 'react-redux';

const AddIssue = ({currentProject}) => {
  const dispatch = useDispatch();
    const fileInputRef = useRef(null);
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState("No File Choose");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("Open");
    const [priority, setPriority] = useState("Low");

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        console.log(selectedFile);
        if (selectedFile) {
            setFileName(selectedFile.name);
            setFile(selectedFile);
        }
    };

    const handleStatusChange = (val) => {
        setStatus(val);
    }

    const handlePriorityChange = (val) => {
        setPriority(val);
    }

    const handleButtonCLick = async () => {
        if(currentProject.length<=0) {
            alert("select project name");
            return ;
        }
        // Basic validation
        if ( !title || !description || !status || !priority) {
            console.error('Please fill in all fields and select a file.');
            return;
        }
        const formData = new FormData();
        if(file){
            formData.append('file', file);
        }
        formData.append('currentProject', currentProject);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('status', status);
        formData.append('priority', priority);

        try {
            const response = await fetch('http://localhost:3000/api/issue', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                console.log('File uploaded successfully');
                fetchAllIssueData().then((res)=>{
                    console.log(res);
                    dispatch(addData(res));
                  });
            } else {
                console.error('Error uploading file');
            }
        } catch (error) {
            console.error('Error uploading file', error);
        }
        setFile(null);
        setStatus("Open");
        setPriority("Low");
        setTitle("");
        setDescription("");
        setFileName("No File Choose");
    };

    useEffect(()=>{
        fetchAllIssueData().then((res)=>{
          console.log(res);
          dispatch(addData(res));
        });
      }, []);

    return (
        <Form onSubmit={(e) => e.preventDefault()}>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} type="text" placeholder='Title' required />
            <Select>
                <Label>
                    Status
                </Label>
                <List className='gap-[9px]'>
                    <Option className={`${status == "Open" ? "bg-[#57b6f0] bg-opacity-20 p-1 rounded-full" : "p-1 rounded-full"}`} onClick={() => handleStatusChange("Open")} title='Open'> <div className="primaryBlue p-1 rounded-full text-white text-xs cursor-pointer"><BiSolidHourglassBottom /> </div> </Option>
                    <Option className={`${status == "In Progress" ? "bg-[#57b6f0] bg-opacity-20 p-1 rounded-full" : "p-1 rounded-full"}`} onClick={() => handleStatusChange("In Progress")} title='In Progress'> <div className="text-[#d94841] text-xl cursor-pointer"><BiSolidPieChart /> </div> </Option>
                    <Option className={`${status == "Close" ? "bg-[#57b6f0] bg-opacity-20 p-1 rounded-full" : "p-1 rounded-full"}`} onClick={() => handleStatusChange("Close")} title='Close'> <div className='bg-[#83bf6e] p-1 rounded-full text-white text-xs cursor-pointer'><BiSolidHourglassTop /> </div> </Option>
                </List>
            </Select>

            <Select>
                <Label>
                    Priority
                </Label>
                <List className='gap-3'>
                    <Option className={`${priority == "Low" ? "bg-[#57b6f0] bg-opacity-20 p-1 rounded-full" : "p-1 rounded-full"}`} onClick={() => handlePriorityChange("Low")} title='Low'><div className='cursor-pointer text-[#83bf6e] rounded-full text-lg'><HiFlag /></div></Option>
                    <Option className={`${priority == "Medium" ? "bg-[#57b6f0] bg-opacity-20 p-1 rounded-full" : "p-1 rounded-full"}`} onClick={() => handlePriorityChange("Medium")} title='Medium'><div className='cursor-pointer text-[#d9b641] rounded-full text-lg'><HiFlag /></div></Option>
                    <Option className={`${priority == "High" ? "bg-[#57b6f0] bg-opacity-20 p-1 rounded-full" : "p-1 rounded-full"}`} onClick={() => handlePriorityChange("High")} title='High'><div className='cursor-pointer text-[#d94841] rounded-full text-lg'><HiFlag /></div></Option>
                </List>
            </Select>

            <File
                onClick={() => fileInputRef.current.click()}>Upload File</File>
            <input ref={fileInputRef} onChange={handleFileChange} className='hidden' type="file" name="attachment" />
            <p className='text-center text-xs font-bold text-[#666]'>{fileName}</p>
            <Description value={description} onChange={(e) => setDescription(e.target.value)} placeholder="description"></Description>

            <Button onClick={handleButtonCLick}>Add Issue</Button>
        </Form>
    )
}

const Form = tw.form`flex flex-col gap-4 px-4 pb-6 pt-10 bg-white rounded-md shadow-md`;
const Input = tw.input`bg-[#6a7185] bg-opacity-5 placeholder:text-[#999] placeholder:font-semibold text-lg tracking-wide p-3 rounded-md shadow-inner focus:outline-none`
const Select = tw.div`flex justify-between items-center`;
const Label = tw.h1`text-xs tracking-wide font-semibold blue rounded-md py-1 px-2 bg-[#57b6f0] bg-opacity-10`;
const List = tw.ul`flex gap-2 items-center`;
const Option = tw.li``;
const File = tw.button`text-sm tracking-wide font-semibold blue rounded-md p-4 bg-[#57b6f0] bg-opacity-10 shadow-sm`;
const Description = tw.textarea`bg-[#6a7185] bg-opacity-5 placeholder:text-[#999] placeholder:font-semibold text-lg tracking-wide p-3 rounded-md shadow-inner capitalize focus:outline-none`;
const Button = tw.button`gradientBlue text-white p-3 rounded-md`;

export default AddIssue

