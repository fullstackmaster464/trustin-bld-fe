import { Form ,Image} from 'antd';
import Country from "../../assets/img/Country.svg";
import 'flag-icons/css/flag-icons.min.css';

const CountryFlag = (props:any) => {
    const {isoCode} = props
    return (
        <Form.Item name="phonecode" noStyle className="codesec">
          <span className="mobile">
              <span style={{color:"#929292",cursor:"not-allowed"}} className='flag-global'>
                {isoCode ? 
                <span className={`fi fi-${isoCode.toLowerCase()}`} />
                :
                <span>
                    <Image
                      preview={false}
                      src={Country}
                      alt="country"
                      className="prefix"
                    />
                  </span>}
              
              </span>
          </span>
        </Form.Item>
      );
}

export default CountryFlag
