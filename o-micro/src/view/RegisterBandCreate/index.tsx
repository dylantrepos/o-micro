import './style.scss'
import {ReactElement, useState} from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
import {createBand} from '../../viewModel/BandViewModel';
import {ToastElement, callToast} from '../../components/Toast';
import {Link, useNavigate} from "react-router-dom";
import logoImg from '../../assets/images/omicro-logo-lg.png';
import { Users } from 'react-feather';

interface IFormCreateInput {
  id: string;
  name: string,
  password :string,
  confirmPassword: string,
}


export default (): ReactElement => {
  const { register, handleSubmit, watch, formState: {errors} } = useForm<IFormCreateInput>();
  const [isOpen, setIsOpen] = useState(false);
  const [myApiID, setMyApiID] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const onSubmitCreate: SubmitHandler<IFormCreateInput> = async data => {
    console.log('Creating...')
     try {
       const idBand = await createBand(data);
       setMyApiID((old) => idBand);
       setIsOpen((old) => true);
       setLoading((old) => false);
       navigate('/home');
     }
     catch (e: any) {
      callToast({message :e.message});
     }
  };
  
  return (

<div className="registerCreate_container">
      <div className="registerCreate_infoContainer">
        <img className='registerCreate_logo' src={logoImg} />
        <h2 className='registerCreate_title'>Créer un groupe</h2>
        <div className="registerCreate_descriptionBox">
        <Users className="registerCreate_descriptionIcon" />
        <p className="registerCreate_description">
        Une fois le groupe créer, vous pourrez <span> générer un mot de passe dans votre profil</span> pour ajouter de nouveaux membres.
        </p>
        </div>
      </div>
      <div className="registerCreate_formAccountContainer">

      <form 
        onSubmit={handleSubmit(onSubmitCreate)} 
        className='registerCreate_form'
      >
        <div className='registerCreate_box'>
         <div  className='registerCreate_inputContainer'>
         <Users className="registerCreate_inputIcon" />
         <input 
            {...register("name")} 
            required
            placeholder='Nom du groupe'
          />
          </div>
            {errors.name ? <p className='register_errors'>{errors.name?.message}</p> : ''}
        </div>

        <button className='registerCreate_submitBtn' type="submit">Créer un groupe</button>
      </form>
      <Link className='registerCreate_noAccountLink' to="/register/band">Rejoindre un groupe</Link>
      </div>
      <ToastElement />
    </div>
    )
}



