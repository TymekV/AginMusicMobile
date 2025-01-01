import * as Application from 'expo-application';

export type AppConfig = {
    /** Client name sent in OpenSubsonic requests */
    clientName: string;

    /** Client version appended to the clientName when sending OpenSubsonic requests */
    clientVersion: string;

    /** Specifies the [OpenSubsonic protocol version](https://opensubsonic.netlify.app/docs/subsonic-versions) */
    protocolVersion: string;

    /** GitHub repository URL displayed in user info sheet */
    repoUrl?: string;
};

const config: AppConfig = {
    clientName: 'AginMusic',
    clientVersion: Application.nativeApplicationVersion ?? '',
    protocolVersion: '1.16.1',
    repoUrl: 'https://github.com/TymekV/AginMusicMobile'
};

export default config;