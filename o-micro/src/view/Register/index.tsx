import './style.scss';
import logoImg from '../../assets/images/omicro-logo-lg.png';
import { ReactElement } from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
import { createUserAccount } from '../../viewModel/UserViewModel';
import { Link, useNavigate } from 'react-router-dom';
import {ToastElement, callToast} from '../../components/Toast';
import { Lock, Mail, User } from 'react-feather';


interface IFormInput {
  firstname: string;
  email: string;
  password: string,
  confirmPassword: string,
}

export default (): ReactElement => {
  const { register, handleSubmit, watch, formState: {errors} } = useForm<IFormInput>();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<IFormInput> = async data => {
    try {
      const res = await createUserAccount(data);
      navigate('/register/band');
    } catch (e: any) {
      callToast({message: e});
    }
  };
  
  return (
    <div className="register_container">
      <div className="register_infoContainer">
        <img className='register_logo' src={logoImg} />
        <h2 className='register_title'>Inscription</h2>
        <p className="register_description">
         Inscrivez-vous rapidement en moins de 2 minutes.
        </p>
      </div>
      <div className="register_formAccountContainer">
        <form 
          onSubmit={handleSubmit(onSubmit)} 
          className='register_form'
        >
          <div className='register_box'>
          <div  className='register_inputContainer'>
          <User className="register_inputIcon"/>
          <input 
                {...register("firstname")} 
                required
                placeholder='Nom'
              />
            </div>
              {errors.email ? <p className='register_errors'>{errors.email?.message}</p> : ''}
          </div>
          <div className='register_box'>
          <div  className='register_inputContainer'>
          <Mail className="register_inputIcon" />
          <input {...register("email", { required: "Merci de remplir ce champ.", pattern: {
                                  value: /\w*@\w*\.[a-z]*/,
                                  message: 'Merci de rentrer une adresse email valide.'
                                  }})} required placeholder='Adresse email'/>
            </div>
              {errors.email ? <p className='register_errors'>{errors.email?.message}</p> : ''}
          </div>
          <div className='register_box'>
          <div  className='register_inputContainer'>
          <Lock className="register_inputIcon" />
          <input type="password" {...register("password", { 
                  required: "Merci de remplir ce champ.", 
                  minLength: {
                    value: 8,
                    message: "Votre mot de passe doit contenir au minimum 8 caractères."}, 
                  pattern: {
                      value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/,
                      message: "Votre mot de passe doit contenir au moins 1 minuscule, 1 majuscule, 1 chiffre."
                  }})} required placeholder='Mot de passe'/>
            </div>
              {errors.email ? <p className='register_errors'>{errors.email?.message}</p> : ''}
          </div>
          <div className='register_box'>
          <div  className='register_inputContainer'>
          <Lock className="register_inputIcon" />
          <input 
                {...register("confirmPassword", {
                  validate: (value, formValues) => value === watch('password') || 'Les mots de passe ne correspondent pas.'
                })} 
                type="password"
                required
                placeholder='Confirmez le mot de passe'
              />
            </div>
              {errors.email ? <p className='register_errors'>{errors.email?.message}</p> : ''}
          </div>
        <button className='register_submitBtn' type="submit">Créer un compte</button>
      </form>
      <Link className='register_noAccountLink' to="/">Se connecter</Link>
      </div>
      <ToastElement />
    </div>
  )
}
