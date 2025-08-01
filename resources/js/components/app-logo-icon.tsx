import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    const { logo } = usePage<SharedData>().props;
    console.log('AppLogoIcon', logo);
    return <img src={logo} alt="App Logo" {...props} />;
}
