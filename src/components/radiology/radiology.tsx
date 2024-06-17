"use client";
import React, { useState } from 'react';
import { z, ZodType } from "zod";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import styled from 'styled-components';
import style from './radiology.module.css';
import { RiDeleteBinLine } from "react-icons/ri";
import { useDropzone } from 'react-dropzone';


// Define the TypeScript interface for a report
interface Report {
  testName: string;
  date: string;
  doctor: string;
  diagnosis: string;
  image?: File;
}

// Define the TypeScript interface for form data
interface FormData {
  testName: string;
  date: string;
  doctor: string;
  diagnosis: string;
  image?: File;
  addnewreport: Report[];
}

// Define the Zod schema for a report
const reportSchema = z.object({
  testName: z.string().min(3, "Test name must be at least 3 characters long").max(50, "Test name must be at most 50 characters long"),
  date: z.string().refine(value => !isNaN(Date.parse(value)), { message: "Date is required" }),
  doctor: z.string().min(3, "Doctor's name must be at least 3 characters long").max(50, "Doctor's name must be at most 50 characters long"),
  diagnosis: z.string().min(3, "Diagnosis must be at least 3 characters long").max(50, "Diagnosis must be at most 50 characters long"),
  image: z.instanceof(File).optional(), // Validate image as a File object
});

// Define the Zod schema for form data
const schema: ZodType<FormData> = z.object({
  testName: z.string().min(3, "Test name must be at least 3 characters long").max(50, "Test name must be at most 50 characters long"),
  date: z.string().refine(value => !isNaN(Date.parse(value)), { message: "Date is required" }),
  doctor: z.string().min(3, "Doctor's name must be at least 3 characters long").max(50, "Doctor's name must be at most 50 characters long"),
  diagnosis: z.string().min(3, "Diagnosis must be at least 3 characters long").max(50, "Diagnosis must be at most 50 characters long"),
  image: z.instanceof(File).optional(), // Validate image as a File object
  addnewreport: z.array(reportSchema), // Ensure this is always an array
});

// Styled components
const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 15px;
  margin-top: 8px;
`;

const Input = styled.input`
  padding: 5px 5px 5px 38px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 86%;
  box-sizing: border-box;
  background-image: url('searchicon.png');
  background-repeat: no-repeat;
  background-position: 10px center;
  background-size: 25px 25px;
`;

const ErrorMessage = styled.span`
  color: red;
  font-size: 12px;
`;

const Button = styled.button`
  padding: 5px 5px 5px 38px;
  color: black;
  border: 1px solid black;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 30px;
  background-image: url('add.png');
  background-repeat: no-repeat;
  background-position: 10px center;
  background-size: 25px 25px;

`;

const ImagePreview = styled.img`
  width: 40px;
  height: 40px;
  object-fit: cover;
  margin-top: 10px;
   height: 50px;
    width: 50px;
    border: 1px solid black;
    margin-right: 100px;
    border-radius: 10px;
    object-fit: cover;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 20px;
  margin-left: 10px;
`;

const DropzoneContainer = styled.div`
  border: 2px dashed #007bff;
  border-radius: 4px;
  padding: 7px;
  text-align: center;
  cursor: pointer;
  margin-top: 8px;
  margin-bottom: 8px;
  position: relative;
`;

const IconContainer = styled.div`
  font-size: 18px;
  color: #007bff;
  margin-bottom: 3px;
  display: flex;
  justify-content: center;
`;

const CustomImage = styled.img`
  width: 30px;
  height: 30px;
`;

const Radiology: React.FC = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [reportPreviews, setReportPreviews] = useState<string[]>([]);

  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      testName: '',
      date: '',
      doctor: '',
      diagnosis: '',
      addnewreport: []
    }
  });

  const { register, handleSubmit, control, formState: { errors } } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "addnewreport",
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  const handleImageChange = (files: File[]) => {
    const file = files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      methods.setValue("image", file);
    }
  };

  const handleDeleteImage = () => {
    setImagePreview(null);
    methods.setValue("image", undefined);
  };

  const handleReportImageChange = (files: File[], index: number) => {
    const file = files[0];
    if (file) {
      setReportPreviews((prev) => {
        const newPreviews = [...prev];
        newPreviews[index] = URL.createObjectURL(file);
        return newPreviews;
      });
      methods.setValue(`addnewreport.${index}.image`, file);
    }
  };

  const handleDeleteReportImage = (index: number) => {
    setReportPreviews((prev) => {
      const newPreviews = [...prev];
      newPreviews[index] = "";
      return newPreviews;
    });
    methods.setValue(`addnewreport.${index}.image`, undefined);
  };

  const { getRootProps: getRootPropsMain, getInputProps: getInputPropsMain } = useDropzone({
    onDrop: handleImageChange,
    accept: { 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'], 'application/pdf': ['.pdf'], 'application/dicom': ['.dicom'] },
    maxSize: 10485760 // 10MB
  });

  return (
    <div className={style.home}>
      <div className={style.addbtn}>
        <Button type="button" onClick={() => append({ testName: "", date: "", doctor: "", diagnosis: "" })}>
          Add new report
        </Button>
      </div>
      <div className={style.container}>
        <div className={style.nav}>
          <FormProvider {...methods}>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <FormGroup>
                <div className={style.searchitem}>
                  <div>
                    <Input id="testName" {...register("testName")} placeholder='Radiology Test Name' />
                    {errors.testName && <ErrorMessage>{errors.testName?.message}</ErrorMessage>}
                  </div>
                  <div>
                    <Input type="date" id="date" {...register("date")} placeholder='Select Date' />
                    {errors.date && <ErrorMessage>{errors.date?.message}</ErrorMessage>}
                  </div>
                  <div>
                    <Input id="doctor" {...register("doctor")} placeholder='Performing Doctor' />
                    {errors.doctor && <ErrorMessage>{errors.doctor?.message}</ErrorMessage>}
                  </div>
                  <div>
                    <Input id="diagnosis" {...register("diagnosis")} placeholder='Add Diagnosis' />
                    {errors.diagnosis && <ErrorMessage>{errors.diagnosis?.message}</ErrorMessage>}
                  </div>
                </div>
                <div className={style.btnsec}>
                  <RiDeleteBinLine type="button" onClick={handleDeleteImage} className={style.deletebtn} />
                  <IconButton type="button">📌</IconButton>
                </div>
              </FormGroup>

              <div className={style.folder}>
              <div className={style.imagebox}>{imagePreview && <ImagePreview src={imagePreview} alt="Preview" />}</div>
                <DropzoneContainer {...getRootPropsMain()}>
                  <input {...getInputPropsMain()} />
                  <IconContainer>
                    <CustomImage src='/upload.png' alt="Upload Icon" />
                  </IconContainer>
                  <p className={style.para}><b>Click to upload</b> or drag and drop</p>
                  <p className={style.para}>PNG, JPG or PDF Or DICON |MAX. Size 10 MB</p>
                </DropzoneContainer>
                
              </div>

              {fields.map((field, index) => (
                <ReportItem
                  key={field.id}
                  field={field}
                  index={index}
                  register={register}
                  errors={errors}
                  handleReportImageChange={handleReportImageChange}
                  handleDeleteReportImage={handleDeleteReportImage}
                  reportPreviews={reportPreviews}
                />
              ))}
              <Button type="submit">Submit</Button>
            </Form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
};

interface ReportItemProps {
  field: Report;
  index: number;
  register: any;
  errors: any;
  handleReportImageChange: (files: File[], index: number) => void;
  handleDeleteReportImage: (index: number) => void;
  reportPreviews: string[];
}

const ReportItem: React.FC<ReportItemProps> = ({ field, index, register, errors, handleReportImageChange, handleDeleteReportImage, reportPreviews }) => {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (files) => handleReportImageChange(files, index),
    accept: { 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'], 'application/pdf': ['.pdf'], 'application/dicom': ['.dicom'] },
    maxSize: 10485760 // 10MB
  });

  return (
    <div className={style.container1}>
      <div className={style.nav}>
        <FormGroup>
          <div className={style.searchitem}>
            <div>
              <Input id={`addnewreport.${index}.testName`} {...register(`addnewreport.${index}.testName`)} placeholder='Radiology Test Name' />
              {errors.addnewreport?.[index]?.testName && <ErrorMessage>{errors.addnewreport[index]?.testName?.message}</ErrorMessage>}
            </div>
            <div>
              <Input type="date" id={`addnewreport.${index}.date`} {...register(`addnewreport.${index}.date`)} placeholder='Select Date' />
              {errors.addnewreport?.[index]?.date && <ErrorMessage>{errors.addnewreport[index]?.date?.message}</ErrorMessage>}
            </div>
            <div>
              <Input id={`addnewreport.${index}.doctor`} {...register(`addnewreport.${index}.doctor`)} placeholder='Performing Doctor' />
              {errors.addnewreport?.[index]?.doctor && <ErrorMessage>{errors.addnewreport[index]?.doctor?.message}</ErrorMessage>}
            </div>
            <div>
              <Input id={`addnewreport.${index}.diagnosis`} {...register(`addnewreport.${index}.diagnosis`)} placeholder='Add Diagnosis' />
              {errors.addnewreport?.[index]?.diagnosis && <ErrorMessage>{errors.addnewreport[index]?.diagnosis?.message}</ErrorMessage>}
            </div>
          </div>
          <div className={style.btnsec}>
            <RiDeleteBinLine type="button" onClick={() => handleDeleteReportImage(index)} className={style.deletebtn} />
            <IconButton type="button">📌</IconButton>
          </div>
        </FormGroup>
      </div>
      <div className={style.folder}>
        {!reportPreviews[index] && (
          <DropzoneContainer {...getRootProps()}>
            <input {...getInputProps()} />
            <IconContainer>
              <CustomImage src='/upload.png' alt="Upload Icon" />
            </IconContainer>
            <p className={style.para}><b>Click to upload</b> or drag and drop</p>
            <p className={style.para}>PNG, JPG or PDF Or DICON |MAX. Size 10 MB</p>
          </DropzoneContainer>
        )}
        {reportPreviews[index] && <ImagePreview src={reportPreviews[index]} alt="Preview" />}
      </div>
    </div>
  );
};

export default Radiology;
