import {useEffect, useState} from "react";



function HomePage()
{

    const[file,setFile]=useState(null);
    const[message,SetMessage]=useState("");

    const handleFileChange=(event)=>
    {
        setFile(event.target.files[0]);
    }

    const handleSubmit=async(event)=>
    {
        event.preventDefault();

        if(file){
            console.log("selected file:",file);
            alert("file inserted");
            const formData = new FormData();
            formData.append("file", file);

        const prediction=await fetch("http://localhost:5000/predict",
            {
                method:"POST",
                body: formData,
                });
        const predicted_value=await prediction.json();
         SetMessage(predicted_value.message);
         alert(predicted_value.message);
         
        }
        else{
            console.log("no file selected");
            alert("no file inserted");
        }

       
    }
    useEffect(()=>
        {
            
                alert(message);
            
        },[message]);
    return(
        <div>

        <h1>Welcome to the Dental Caries Detection Model</h1>

        <form onSubmit={handleSubmit}>

            <input type="file" accept="image/*" onChange={handleFileChange} />

            <button type="submit"> Upload Image</button>
        </form>
        </div>
    )
}


export default HomePage;