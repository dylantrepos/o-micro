export default class ValidationError extends Error {
    error;
    codeError;
    
    constructor(error: any) {
        super();
        this.error = error;
        this.codeError = error.response.status;
    }

    getErrorMessage(): string {
        if(this.codeError == 401) return 'Vous n\'êtes pas identifié(e) !';
        if(this.codeError >= 400 && this.codeError < 500) return 'Page ou route introuvable.';
        if(this.codeError >= 500) return 'Erreur serveur.';
        return 'Erreur inconnue.';
    }

    getErrorMessageLogin(): string {
        if(this.codeError == 422) return 'Cet adresse mail existe déjà.';
        if(this.codeError == 401) return 'Email ou mot de passe incorrect.';
        if(this.codeError >= 400 && this.codeError < 500) return 'Page ou route introuvable.';
        if(this.codeError >= 500) return 'Erreur serveur.';
        return 'Erreur inconnue.';
    }
}