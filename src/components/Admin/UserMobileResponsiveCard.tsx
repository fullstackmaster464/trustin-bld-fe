import { useState } from 'react';
import { Col, Checkbox} from 'antd';

interface Column {
    title:string,
    dataIndex: string,
    sorter?: boolean,
    width?: number,
    render?: Function,
}

interface UserMobileResponsiveCardProps {
   UserList: [];
   download?:Function;
   setSelected: Function;
   selectedUserAlias: string[];
   setSelectedUserAlias: Function;
   selectAll: boolean;
   setSelectAll: Function;
  updateStatus?:Function;
   columns: Column[];
  }
const UserMobileResponsiveCard = (props: UserMobileResponsiveCardProps) => {
  const { UserList, setSelected, selectedUserAlias, setSelectedUserAlias, selectAll, setSelectAll,columns } = props;

  const [selectedRows, setSelectedRows] = useState<any>([]);

  const onCheckboxChange = (userAlias: string, rowData: any) => {
    const updatedSelectedUserAlias = [...selectedUserAlias];
    const updatedSelectedRows = [...selectedRows];

    const isSelected = updatedSelectedUserAlias.includes(userAlias);

    if (isSelected) {
      const index = updatedSelectedUserAlias.indexOf(userAlias);
      if (index !== -1) {
        updatedSelectedUserAlias.splice(index, 1);
      }
      const rowIndex = updatedSelectedRows.findIndex((row) => row.userAlias === userAlias);
      if (rowIndex !== -1) {
        updatedSelectedRows.splice(rowIndex, 1);
      }
    } else {
      updatedSelectedUserAlias.push(userAlias);
      updatedSelectedRows.push(rowData);
    }
    updatedSelectedUserAlias?.length > 0 ? setSelected(true) : setSelected(false)
    setSelectedUserAlias(updatedSelectedUserAlias);
    setSelectedRows(updatedSelectedRows);
    setSelectAll(updatedSelectedUserAlias.length === UserList.length);

  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedUserAlias([]);
      setSelectedRows([]);
      setSelected(false)
    } else {
      const allUserAliases = UserList.map((item: any) => item.userAlias);
      setSelectedUserAlias(allUserAliases);
      setSelectedRows([...UserList]);
      setSelected(true)
    }
    setSelectAll(!selectAll);
  };

  return (
    <>
      <div className="itemTypes-mobile-view">
        <Checkbox checked={selectAll} onChange={toggleSelectAll}>Select all </Checkbox>
      {UserList.map((item: any, index: any) => (
        <div className="mobile-card row" key={index}>
          <Col xs={2} sm={2}>
            <Checkbox
                  checked={selectedUserAlias.includes(item.userAlias)}
                  onChange={() => onCheckboxChange(item.userAlias, item)}
                />
          </Col>
          <div className="mobile-card row col-10 col-sm-10">
           {columns.map((column:any, index:any) => ( 
            <div key={`${item.name}-${index}`} className="sub-body col-6 col-sm-4">
              <div className="mobile-header">
                {column.title}
              </div>
              <div className="mobile-data action-mobile-data">{column.render ? column.render(item[column.dataIndex],item) : item[column.dataIndex]}</div>
            </div>
           ))}
          </div>
        </div>
        ))}
    </div>
    </>
  );
};

export default UserMobileResponsiveCard;