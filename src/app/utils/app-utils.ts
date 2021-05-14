export class AppUtils {
    getCookie(name: string): string | undefined {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts && parts.length === 2) {
            return parts.pop()?.split(';').shift();
        }
        return;
    }

    listCookies(): object {
        return document.cookie.split(';').reduce((cookies, cookie) => {
            const [name, value] = cookie.split('=').map(c => c.trim());
            return { ...cookies, [name]: value };
        }, {});
    }

    setCookies(): void { }
}
