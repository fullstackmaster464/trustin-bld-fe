import React, { useEffect } from "react";
import { Modal, Form, Input, Button } from "antd";

const { TextArea } = Input;

export interface CommentModalFormProps {
  open: boolean;
  title: string;
  isErrorTitle?: boolean;
  comment: string;
  onCommentChange: (value: string) => void;
  onSubmit: (values: { comment: string }) => void;
  onCancel: () => void;
  form: any;
  loading?: boolean;
  maxCommentLength: number;
}

const validatePopupCommentFields = (value: any, maxCommentLength: number) => {
  if (!value || value.trim() === "") {
    return Promise.reject(
      new Error("Please add some comment!")
    );
  }

  if (!/^[a-zA-Z0-9\s,\/#?\-\.]*$/.test(value)) {
    return Promise.reject(
      new Error("Only letters, numbers, spaces, and , - ? # / . are allowed")
    );
  }

  if (value.length < 20) {
    return Promise.reject(
      new Error("Please enter minimum 20 characters")
    );
  }

  if (value.length > maxCommentLength) {
    return Promise.reject(
      new Error(`Maximum characters allowed: ${maxCommentLength}`)
    );
  }

  return Promise.resolve();
};

export const CommentModalForm: React.FC<CommentModalFormProps> = ({
  open,
  title,
  isErrorTitle = false,
  comment,
  onCommentChange,
  onSubmit,
  onCancel,
  form,
  loading = false,
  maxCommentLength,
}) => {
  useEffect(() => {
    if (open) {
      form.setFieldsValue({ comment });
    }
  }, [open, comment, form]);

  return (
    <Modal
      open={open}
      footer={false}
      centered
      className="classification-modal"
      title={
        <span
          className={`change-client-classification ${
            isErrorTitle ? "errMsg" : ""
          }`}
        >
          {title}
          <hr className="lightgrayHr" />
        </span>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
        scrollToFirstError
        className="py-2"
        name="comment_form"
      >
        <div className="subText mb-4">Comment *</div>
        <Form.Item
          name="comment"
          className="modal_inputField"
          rules={[
            {
              validator: async (_, value) => validatePopupCommentFields(value, maxCommentLength),
            }
          ]}
        >
          <TextArea
            rows={3}
            showCount
            placeholder="Please enter your comment"
            className="modalTextArea mt-4 p-3"
            value={comment}
            onChange={(e) => onCommentChange(e.target.value)}
          />
        </Form.Item>

        <div>
          <Button
            key="submit"
            type="primary"
            htmlType="submit"
            loading={loading}
            className="modal-button mt-5"
          >
            Submit
          </Button>
          <Button
            key="cancel"
            type="primary"
            onClick={onCancel}
            className="modal-button-cancel mt-5 mx-2"
          >
            Cancel
          </Button>
        </div>
      </Form>
    </Modal>
  );
};
