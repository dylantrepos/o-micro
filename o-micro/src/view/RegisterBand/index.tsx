import './style.scss'
import logoImg from '../../assets/images/omicro-logo-lg.png';
import {ReactElement} from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
import {joinBand} from '../../viewModel/BandViewModel';
import {ToastElement, callToast} from '../../components/Toast';
import {Link, useNavigate} from "react-router-dom";
import { Mail, User } from 'react-feather';

interface IFormJoinInput {
  bandId: string,
  bandPassword: string,
  bandConfirmPassword: string,
}


export default (): ReactElement => {
  const { register, handleSubmit, watch, formState: {errors} } = useForm<IFormJoinInput>();

  const navigate = useNavigate();

  const onSubmitJoin: SubmitHandler<IFormJoinInput> = async data => {
    console.log('Joining ...');
     try {
       const band = await joinBand(data);
       navigate('/home');
     } catch (e: any) {
      callToast({message :e.message});
     }
  };

  return (

<div className="register_container">
      <div className="register_infoContainer">
        <img className='register_logo' src={logoImg} />
        <h2 className='register_title'>Rejoindre un groupe</h2>
        <p className="register_description">
        Demandez l’identifiant et le mot de passe de votre groupe aux autres membres déjà présents.
        </p>
      </div>
      <div className="register_formAccountContainer">

      <form 
        onSubmit={handleSubmit(onSubmitJoin)} 
        className='register_form'
      >
        <div className='register_box'>
         <div  className='register_inputContainer'>
         <User className="register_inputIcon" />
         <input 
                    {...register("bandId")} 
                    required
                    placeholder='ID du groupe'
                  />
          </div>
            {errors.bandId ? <p className='register_errors'>{errors.bandId?.message}</p> : ''}
        </div>
        <div className='register_box'>
         <div  className='register_inputContainer'>
         <Mail className="register_inputIcon"/>
         <input 
                    {...register("bandPassword") } 
                    type="password"
                    required
                    placeholder='Mot de passe'
                  />
          </div>
            {errors.bandPassword ? <p className='register_errors'>{errors.bandPassword?.message}</p> : ''}
        </div>

        <button className='register_submitBtn' type="submit">Rejoindre</button>
      </form>
      <Link className='register_noAccountLink' to="/register/band/create">Créer un groupe</Link>
      </div>
      <ToastElement />
    </div>
    )
}



