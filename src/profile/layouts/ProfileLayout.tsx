
import { Outlet } from 'react-router';
import { CustomHeaderProfile } from '../components/CustomHeaderProfile';

const ProfileLayout = () => {
    return (
        <div className='min-h-screen'>

            <CustomHeaderProfile />
            <div className="flex flex-col items-center justify-center bg-muted p-2 md:p-4">
                <div className="w-full max-w-sm md:max-w-3xl">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default ProfileLayout;
