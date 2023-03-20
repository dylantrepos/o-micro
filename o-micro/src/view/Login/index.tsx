import { ReactElement } from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
import logoImg from '../../assets/images/omicro-logo-lg.png';
import {ToastElement, callToast} from '../../components/Toast';
import { loginUserAccount } from '../../viewModel/UserViewModel';
import './style.scss'
import { Lock, Mail } from 'react-feather';

import { Link, useNavigate } from 'react-router-dom';

interface IFormInput {
  email: string;
  password: string,
}

export default (): ReactElement => {
  const { register, handleSubmit, formState: {errors} } = useForm<IFormInput>();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<IFormInput> = async data => {
    try {
      const res = await loginUserAccount(data.email, data.password);
      if (res) navigate('/home');
    } catch (e: any) {
      callToast({message: e});
    }
  };

  return (
    <div className="login_container">
      <div className="login_infoContainer">
        <img className='login_logo' src={logoImg} />
        <h2 className='login_title'>L'appli au service des musiciens</h2>
        <p className="login_description">
          L'objectif est de permettre aux différents membres d'un même groupe d'enregistrer des idées pour un nouveau morceau et de le partager aux autres membres.
        </p>
      </div>
      <div className="login_formAccountContainer">
      <form 
        onSubmit={handleSubmit(onSubmit)} 
        className='login_form'
      >
        <div className='login_box'>
         <div  className='login_inputContainer'>
         <Mail className='login_inputIcon'/>
          <input {...register("email", { required: "Merci de remplir ce champ.", pattern: {
                                value: /\w*@\w*\.[a-z]*/,
                                message: 'Merci de rentrer une adresse email valide.'
                                }})} placeholder="Adresse email" 
                                required 
                                />
          </div>
            {errors.email ? <p className='register_errors'>{errors.email?.message}</p> : ''}
        </div>
        <div className='login_box'>
        <div  className='login_inputContainer'>
         <Lock className="login_inputIcon" />
          <input 
            {...register("password") } 
            type="password"
            placeholder='Mot de passe'
            required
          />
          </div>
        </div>
        <button className='login_submitBtn' type="submit">Se connecter</button>
      </form>
      <Link className='login_noAccountLink' to="/register">Créer un compte</Link>
      </div>
      <ToastElement />
    </div>
  )
}
