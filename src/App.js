import axios from "axios"
import {useEffect,useState} from 'react';
import {format} from "date-fns"
import './App.css';


const baseUrl = "http://127.0.0.1:5000"


function App() {

  const [description, setDescription] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [eventsList, setEventsList] = useState([]);
  const [eventId, setEventId]= useState([null]);



        const fetchEvents = async () => {
            const  data = await axios.get(`${baseUrl}/events`)
            const{events} = data.data
            setEventsList(events);
          console.log("DATA: ", data)
        }


  const handleChange = (e, field) => {
    if(field === 'edit'){
      setEditDescription(e.target.value);
    }else{
      setDescription(e.target.value);
    }
    
  }


          const handleDelete = async (id) => {
            try{
              await axios.delete(`${baseUrl}/events/${id}`)
                const updatedList = eventsList.filter(event => event.id != id)
              setEventsList(updatedList);
            }catch (err){
              console.error(err.message);
            }
          }


  const handleSubmit = async (e) => {
    e.preventDefault();
try{
   if(editDescription){
    const data = await axios.put(`${baseUrl}/events/${eventId}`,{description: editDescription});
    const updatedEvent = data.data.event;
    const updatedList = eventsList.map(event => {
      if (event.id === eventId) {
        return event = updatedEvent
      }
      return event
    })
    setEventsList(updatedList)
   }else {
        const data = await axios.post(`${baseUrl}/events`, {description})
        setEventsList([...eventsList, data.data]);     
   }
   setDescription('')
   setEditDescription('');
   setEventId(null);
}catch (err){
    console.error(err.message);
}
   
  }


          const toggleEdit = (event) => {
            setEventId(event.id);
            setEditDescription(event.description);

          }





  useEffect(() => {
    fetchEvents();
  },[]) 


  return (
    <div className="App"> 
    <section>
        <form onSubmit={handleSubmit}>
            <label htmlFor='description'>Description</label>
              <input
               onChange={(e) => handleChange(e, 'description')}
                type="text"
                name="description"
                id="description"
                placeholder="Descreva o evento"
              value={description}
              />
            <button type="submit">Submit</button>
        </form>
      </section>




      <section>
        <ul>
            {eventsList.map(event => {
              if(eventId === event.id){
                return(
                <form className="ButtonEdit2" onSubmit={handleSubmit} key={event.id}>
                  <input 
                    onChange={(e) => handleChange(e, 'edit')}
                      type="text"
                        name="editDescription"
                        id="editDescription"
                     value={editDescription}
                  />
                  <button type="submit">Submit</button>
                </form>
                )
              }else {
                return (
                  <li className="ButtonEdit"key={event.id}>
                     
                  <button className="ButtonDelete" onClick={() => handleDelete(event.id)}> delete</button>
                  <button className="ButtonEdit" onClick={() => toggleEdit(event)}>Edit</button>
                  {event.description}
                   
               
                
                  
                  </li>

              )
            }
            })}
        </ul>
      </section>
    </div>
  );
}

export default App;
