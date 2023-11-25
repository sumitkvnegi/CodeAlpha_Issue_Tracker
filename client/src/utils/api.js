export const fetchAllIssueData = async () => {
    const res = await fetch("http://localhost:3000/api/issue");
    const data = await res.json();
    return data;
}

export const deleteIssueData = async (id) => {
    const res = await fetch(`http://localhost:3000/api/issue/${id}`, {
        method: "DELETE",
      });
    const data = await res.json();
    return data;
}

export const fetchProjectNames = async () => {
    const res = await fetch(`http://localhost:3000/api/project`);
    const data = await res.json();
    return data;
}

export const createProjectName = async (name) => {
    console.log("enter")
    const res = await fetch(`http://localhost:3000/api/project`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name }),
    });
    console.log(res)

    return res;
}