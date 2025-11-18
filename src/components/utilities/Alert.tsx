import { Alert } from 'antd';

const Alerts = (props:any) => {
    const {description} = props
    return (
        <Alert
            description={description}
            {...props}
        />
    );
};

export default Alerts;