class AuthService {
  getToken(): string | null {
    return localStorage.getItem("id_token");
  }

  loggedIn(): boolean {
    return !!this.getToken();
  }

  login(token: string): void {
    localStorage.setItem("id_token", token);
    window.location.assign("/");
  }

  logout(): void {
    localStorage.removeItem("id_token");
    window.location.assign("/login");
  }
}

export default new AuthService();