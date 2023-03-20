import React, { ReactElement, useState, useEffect } from 'react';
import Header from '../../components/Header';
import './styles.scss';
import {
  createBand,
  getCurrentBand,
  getRequestPassword,
} from '../../viewModel/BandViewModel';
import { SubmitHandler, useForm } from 'react-hook-form';
import { callToast, ToastElement } from '../../components/Toast';
import { useNavigate } from 'react-router-dom';
import { deleteUserAccount } from '../../viewModel/SettingsViewModel';
import {changeBand, getCurrentUser, updateUser} from '../../viewModel/UserViewModel';

interface Band {
  id?: string;
  name?: string;
}

interface BandData {
  data: Band;
}

interface User {
  userName: string;
  userEmail: string;
}

interface UserData {
  userData: User;
}

interface IFormJoinInput {
  bandId: string,
  bandPassword: string,
}
interface IFormCreateInput {
  bandName: string,
}

interface IFormEditInput {
  userName: string,
  userEmail: string,
}

export default (): ReactElement => {
  // my-band, my account
  const [activeTab, setActiveTab] = useState('my-band');

  //BAND SETTINGS USESTATE & FORM
  const { register, handleSubmit, formState: {errors} } = useForm<IFormJoinInput>();
  const { register: registerCreate, handleSubmit: handleSubmitCreate, formState: {errors: errorsCreate} } = useForm<IFormCreateInput>();

  const [bandPassword, setBandPassword] = useState('');
  const [inviteMemberInfoOpen, setInviteMemberInfoOpen] = useState(false);
  const [changeBandOpen, setChangeBandOpen] = useState(false);
  const [createBandFormOpen, setCreateBandFormOpen] = useState(false);
  const [addMemberOpen, setAddMemberOpen] = useState(true);
  const [band, setBand] = useState<Band>({});
  const navigate = useNavigate();


  //ACCOUNT SETTINGS USESTATE & FORM
  const [user, setUser] = useState<Band>({});
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const { register: registerEdit, handleSubmit: handleSubmitEdit, formState: {errors: errorsEdit} } = useForm<IFormEditInput>();
  const [editAccountOpen, setEditAccountOpen] = useState(false);


  // my-band, my account
  const handleTabBand = () => {
    setActiveTab('my-band');
  }
  const handleTabAccount = () => {
    setActiveTab('my-account');
  }

  /*
  *
  * BAND SETTINGS METHODS
  *
  */

  const handleInvitMemberButtonClick = () => {
    if(!inviteMemberInfoOpen) {
      setInviteMemberInfoOpen(true);
      getRequestPassword().then((password: string) => {
        setBandPassword(password);
      });
    }else {
      setInviteMemberInfoOpen(false);
    }
  }

  const handleCreateBandButtonClick = () => {
    if(!createBandFormOpen) {
      setCreateBandFormOpen(true);
      setAddMemberOpen(false);
    }else {
      setCreateBandFormOpen(false);
      setAddMemberOpen(true);
    }

  }

  const handleChangeBandButtonClick = () => {
    if(!changeBandOpen) {
      setChangeBandOpen(true);
      setAddMemberOpen(false);
    }else {
      setChangeBandOpen(false);
      setAddMemberOpen(true);
    }
  }

  const onSubmitChangeBand: SubmitHandler<IFormJoinInput> = async data => {
    try {
      const band = await changeBand(data);
      setBand(data.data.name)
      navigate('/home');
    } catch (e: any) {
      callToast({message :e.message});
    }
  };
  const onSubmitCreateBand: SubmitHandler<IFormCreateInput> = async data => {
    try {
      const band = await createBand(data);
        setBand(data.data.name);
      navigate('/home');
    } catch (e: any) {
      callToast({message :e.message});
    }
  };

  useEffect(() => {
    const result = getCurrentBand().then((data: BandData) => {
      setBand(data.data);
    });
    const resultUser = getCurrentUser().then((data: UserData) => {
      setUser(data.data);
      setUserName(data.data.name);
      setUserEmail(data.data.email);
     
    });
  }, []);

  useEffect(() => {
    console.log(user);
  }, [user]);
  
  /*
  *
  * ACCOUNT SETTINGS METHODS
  *
  */
  const handleEditAccountButtonClick = () => {
    if(!editAccountOpen) {
      setEditAccountOpen(true);
    } else {
      setEditAccountOpen(false);
    }
  }

  const onSubmitEditAccount: SubmitHandler<IFormEditInput> = async data => {
    console.log(data);
    try {
      const userResponse = await updateUser({
        id: user.id,
        firstname: data.userName,
        email: data.userEmail
      });
      navigate('/home');
    } catch (e: any) {
      callToast({message :e.message});
    }
  };

  const handleDelete = async (event: any) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this account ?");
    if (confirmDelete) {
        const UserDeleted = await deleteUserAccount()
        navigate('/login')
    } else {
        const userData= await getCurrentUser();
        console.log(userData)
        console.log('user name: ',userData.data.firstname,'user password: ', userData.data.password)
        console.log("Account deletion has been undone.");
    }
}


  return (
    <div className='main'>
      <Header />
      <div className='inner settings-page'>
        <h1 className="settings-title">Settings</h1>

        <div className="settings-tabs">
          <div className={`settings-tab ${activeTab === 'my-band' ? 'is-active' : ''}`} onClick={handleTabBand}>
            Mon groupe
          </div>
          <div className={`settings-tab ${activeTab === 'my-account' ? 'is-active' : ''}`} onClick={handleTabAccount}>
            Mon compte
          </div>
        </div>

        <div className="settings-sections">

         {/* MY BAND SETTINGS*/}
          <div className={`settings-section ${activeTab === 'my-band' ? 'is-active' : ''}`}>
            {!changeBandOpen ?
            <div>
              <div className="settings-info">
                <div className="setting-info">
                  <span>Name: </span> {band.name}
                </div>
                <div className="setting-info">
                  <span>ID: </span> {band.id}
                </div>
              </div>
              <div className="settings-band-members">
                <h2 className="settings-band-members-label">Les membres du groupe</h2>
                <div className="settings-band-members-inner">
                  <div className="settings-band-member">
                    JOE
                  </div>
                  <div className="settings-band-member">
                    MARCEL
                  </div>
                  <div className="settings-band-member">
                    MONIQUE
                  </div>
                  <div className="settings-band-member">
                    SUZANNE
                  </div>
                </div>
              </div> 
            </div>: ''}

            {/*Invite a member*/}
            <div className={`invit-member-infos ${ inviteMemberInfoOpen ? 'is-active' : ''} `}>
              <h2 className="label">Comment ajouter un membre ?</h2>
              <p>Partagez ce code aux personnes que vous souhaitez ajouter à votre groupe.</p>
              <div className="settings-info">
                <div className="setting-info">
                  <span>ID: </span> {band.id}
                </div>
                <div className="setting-info">
                  <span>PASSWORD: </span> {bandPassword}
                </div>
              </div>
            </div>


            {/*Change band*/}
            <div className={`change-band ${ changeBandOpen ? 'is-active' : ''} `}>
              <div className='newBand_Container'>
                <form
                  onSubmit={handleSubmit(onSubmitChangeBand)}
                  className='newBand_form'
                >
                  <div className='newBand_box'>
                    <input
                      {...register("bandId")}
                      required
                    />
                    <label>ID du groupe</label>
                  </div>
                  <div className='newBand_box'>
                    <input
                      {...register("bandPassword") }
                      type="password"
                      required
                    />
                    <label>Mot de passe du groupe</label>
                  </div>

                  <div className="settings-band-action">
                    <button className="settings-band-action-button validate form-button">
                      Valider
                    </button>
                  </div>
                </form>
                </div>
            </div>

            {/*Create a band*/}
            <div className={`create-band ${ createBandFormOpen ? 'is-active' : ''} `}>
              <div className='newBand_Container'>
                <form
                    onSubmit={handleSubmitCreate(onSubmitCreateBand)}
                    className='newBand_form'
                >
                  <div className='newBand_box'>
                    <input
                        {...registerCreate("bandName")}
                        required
                    />
                    <label>Nom du nouveau groupe</label>
                  </div>
                  <div className="settings-band-action">
                    <button className="settings-band-action-button validate form-button">
                      Valider
                    </button>
                  </div>
                </form>
              </div>
            </div>


            <div className="settings-band-actions">
            {addMemberOpen ? <div>
            <div className="settings-band-action">
                <button className={`settings-band-action-button addMembers ${inviteMemberInfoOpen ? 'cancel' :''}`} onClick={handleInvitMemberButtonClick}>
                  {inviteMemberInfoOpen ? 'Fermer' : 'Ajouter un membre'}
                </button>
              </div>
            </div> : ''}

              <div className="settings-band-action">
                <button className={`settings-band-action-button ${ createBandFormOpen ? 'cancel' : ''}`} onClick={handleCreateBandButtonClick}>
                  {createBandFormOpen ? 'Annuler' : 'Créer un groupe'}
                </button>
              </div>
              <div className="settings-band-action">
                  <button className={`settings-band-action-button ${ changeBandOpen ? 'cancel' : ''}`} onClick={handleChangeBandButtonClick}>
                    {changeBandOpen ? 'Annuler' : 'Changer de groupe'}
                  </button>
              </div>
            </div>
          </div>

          {/*// ACCOUNT SETTINGS*/}
          <div className={`settings-section ${activeTab === 'my-account' ? 'is-active' : ''}`}>
            <div className={`edit-account ${ editAccountOpen ? 'is-active' : ''} `}>
              <div className='newBand_Container'>
                <form
                    onSubmit={handleSubmitEdit(onSubmitEditAccount)}
                    className='newBand_form'
                >
                  <div className='newBand_box'>
                    <input
                        {...registerEdit("userName")}
                        required
                        value={userName}
                        onChange={(e) => {
                          setUserName(e.currentTarget.value);
                        }}
                    />
                    <label>Nom</label>
                  </div>
                  <div className='newBand_box'>
                    <input {...registerEdit("userEmail", { required: "Merci de remplir ce champ.", pattern: {
                        value: /\w*@\w*\.[a-z]*/,
                        message: 'Merci de rentrer une adresse email valide.'
                      }})}
                    value={userEmail}
                    onChange={(e) => {
                      setUserEmail(e.currentTarget.value);
                    }}
                    />
                    <label>Adresse email</label>
                    {errorsEdit.userEmail ? <p className='register_errors'>{errorsEdit.userEmail?.message}</p> : ''}
                  </div>
                  <div className="settings-band-action">
                    <button className="settings-band-action-button validate form-button">
                      Valider
                    </button>
                  </div>
                </form>
              </div>
            </div>
          <div className="settings-band-actions">
              <div className="settings-band-action">
                <button className={`settings-band-action-button ${ editAccountOpen ? 'cancel' : ''}`} onClick={handleEditAccountButtonClick}>
                  {editAccountOpen ? 'Fermer' : 'Modfier le compte'}
                </button>
              </div>
            {!editAccountOpen ? <div>
              <div className="settings-band-action">
                <button className="settings-band-action-button delete" onClick={handleDelete}>
                  Suppresion du compte
                </button>
              </div>
            </div> : ''}
            </div>
          </div>
        </div>
      </div>
      <ToastElement/>
    </div>
  )
}



