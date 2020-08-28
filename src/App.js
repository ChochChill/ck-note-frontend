import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { Label, Input, Col,
  Button, Modal, ModalHeader, ModalBody,
  ModalFooter, Row,
  Card, CardText, CardBody,
  CardTitle, 
  FormGroup} from 'reactstrap';
import './App.css';

const App = () =>{
  const apiPath = `posts/`

  //State
  const [notes, setNotes] = useState([]);
  const [newNotemodal, setNewNoteModal] = useState(false);
  const [editNotemodal, setEditNoteModal] = useState(false);
  const [deleteNotemodal, setDeleteNoteModal] = useState(false);
  const [noteTitleData, setNoteTitleData] = useState('');
  const [noteDesData, setNoteDesData] = useState('');
  const [noteIdData, setNoteIdData] = useState('');
  const [noteEditTitleData, setNoteEditTitleData] = useState('');
  const [noteEditDesData, setNoteEditDesData] = useState('');

  //runs every reload
  useEffect(() =>{
    const getNotes = async () => {
      const data = await axios.get(apiPath);
      setNotes(data.data.reverse());
    };
    getNotes(); 
  }, [apiPath]);
  
  //function to GET notes from api
  const getNotes = async () => {
    const data = await axios.get(apiPath);
    setNotes(data.data.reverse());
  };


  //function to set edit modal data from a Note 
  const editNote = (id, Title, Note) => {
    setNoteIdData(id);
    setNoteEditTitleData(Title);
    setNoteEditDesData(Note);
    toggleEditNote(); 
  }

  //function to delete a Note via api
  const deleteNote = (id, Title) => {
    setNoteIdData(id);
    setNoteEditTitleData(Title);
    toggleDeleteNote();
  }

  //function to create Note cards using obtained data from api through getNotes() passed as prop from return(<Note/>)
  const Note = ({ Title, Note, Data, id }) => {
    return (
      <div className="noteCards">
        <Row>
          <Col sm="12" md={{ size: 6, offset: 3 }}>
            <Card className="note">
              <CardBody className="cardsBody" >
                <CardTitle><h3>{Title}</h3></CardTitle>
                <CardText>{Note}</CardText>
                <Button id="editButton" className="success_button" onClick={editNote.bind(this, id, Title, Note)}>Edit</Button>{' '}
                <Button id="deleteButton"color="danger" onClick={deleteNote.bind(this, id, Title)} >delete</Button>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  };

  //toggles
  const toggleNewNote = () => setNewNoteModal(!newNotemodal);
  const toggleEditNote = () => setEditNoteModal(!editNotemodal);
  const toggleDeleteNote = () => setDeleteNoteModal(!deleteNotemodal);
  
  //Data handle functions
  //handles user input from the Add a note modal
  const dataJsonCreate = (e) => {
    const target = e.target;
    const name = target.name;
    const value = target.value;
    if(name === "title"){
      setNoteTitleData(value);
    }
    if(name === "description"){
      setNoteDesData(value);
    }
  };

  //handles user input from the Edit a note modal
  const dataJsonEdit = (e) => {
    const target = e.target;
    const name = target.name;
    const value = target.value;
    if (name === "title") {
      setNoteEditTitleData(value);
    }
    if (name === "description") {
      setNoteEditDesData(value);
    }
  };

  //function to POST new Note via api
  const addNote = () => {
    const payload = {
      title: noteTitleData,
      description: noteDesData
    };
    axios({
      url: apiPath,
      method: 'POST',
      data: payload
    })
      .then((Response) => {
        getNotes();
        setNoteTitleData('');
        setNoteDesData('');
        toggleNewNote();
    })
  }
  
  const updateNote = () => {
    axios.put(apiPath + noteIdData,{ 
      description: noteEditDesData,
      title: noteEditTitleData
    }).then((Response) => {
      getNotes();
      toggleEditNote();
    });
  }

  const removeNote = () => {
    axios.delete(apiPath + noteIdData)
    .then((Response) => {
      getNotes();
      toggleDeleteNote();
    });
  }  

  
  return(
    <div className="App">

      {/* "Add a note" Button */}
      <div className="container">
        <div className="center">
          <Button id="newNoteButton" className="success_button" size="lg" onClick={toggleNewNote}>Add a note</Button>
        </div>
      </div>
      
      {/* Add a note modal */}  
      <div>
          <Modal isOpen={newNotemodal} toggle={toggleNewNote}>
            <ModalHeader  toggle={toggleNewNote}>Create Note</ModalHeader>
            <ModalBody>
              <FormGroup id="newNoteForms">
                <Label for="Title" sm={2}>Title</Label>
                <Col sm={12}> 
                <Input id="Title" name="title" value={noteTitleData} onChange={dataJsonCreate}/>
                </Col>
                <Label for="Note" sm={2}>Note</Label>
                <Col sm={12}>
                <Input id="Description" name="description" type="textarea" value={noteDesData} onChange={dataJsonCreate}/>
                </Col>
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button className="success_button" onClick={addNote}>Add note</Button>{' '}
              <Button color="danger" onClick={toggleNewNote}>Cancel</Button>
            </ModalFooter>
          </Modal>
      </div>

      {/* edit a note modal */}
      <div>
          <Modal isOpen={editNotemodal} toggle={toggleEditNote}>
            <ModalHeader  toggle={toggleEditNote}>Edit Note</ModalHeader>
            <ModalBody>
              <FormGroup id="editNoteForms">
                <Label for="Title" sm={2}>Title</Label>
                <Col sm={12}> 
                <Input id="Title" name="title" value={noteEditTitleData} onChange={dataJsonEdit}/>
                </Col>
                <Label for="Note" sm={2}>Note</Label>
                <Col sm={12}>
                <Input id="Description" name="description" type="textarea" value={noteEditDesData} onChange={dataJsonEdit}/>
                </Col>
              </FormGroup>
            </ModalBody>
            <ModalFooter>
            <Button className="success_button" onClick={updateNote}>Update</Button>{' '}
              <Button color="danger" onClick={toggleEditNote}>Cancel</Button>
            </ModalFooter>
          </Modal>
      </div>

      {/* delete a note modal */}
      <div>
        <Modal isOpen={deleteNotemodal} toggle={toggleDeleteNote}>
          <ModalHeader toggle={toggleDeleteNote}>Delete Note</ModalHeader>
          <ModalBody>
            <FormGroup id="editNoteForms">
              <Col sm="12" md={{ size: 6, offset: 3 }}><h4>Are you sure?</h4></Col>
                <Label for="Title" sm={2}>Title</Label>
              <Col sm={12}>
                <Input id="Title" name="title" value={noteEditTitleData} readOnly/>
              </Col>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button className="success_button" onClick={removeNote}>Delete</Button>{' '}
            <Button color="danger" onClick={toggleDeleteNote}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>

      {/* Mounts Notes from api using Note function*/}
      <div>        
        {notes.map(note => (
          <Note key={note._id}
            id={note._id}
            Data={note.data}
            Title={note.title}
            Note={note.description} />
        ))}
      </div>

    </div>
  );
}

export default App;
