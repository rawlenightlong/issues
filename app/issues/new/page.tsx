'use client'
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { TextField, Button, Callout, Text } from '@radix-ui/themes'
import { useForm, Controller} from 'react-hook-form'
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { createIssueSchema } from "@/app/validationSchemas";
import { z } from 'zod'
import ErrorMessage from "@/app/components/errorMessage";
import Spinner from "@/app/components/Spinner";



type IssueForm = z.infer<typeof createIssueSchema>

const NewIssuePage = () => {

   const router = useRouter()

    const {register, control, handleSubmit, formState: { errors }} = useForm<IssueForm>({
        resolver: zodResolver(createIssueSchema)
    })

    const [error, setError ] = useState('')
    const [isSubmitting, setSubmitting] = useState(false)


  return (
    <div className="max-w-xl space-y-3" >

        {error && (
        <Callout.Root color='red' className="mb-5">
            <Callout.Text>{error}</Callout.Text>
        </Callout.Root>
        )}
    <form 
    onSubmit={handleSubmit(async (data) => {
        try {
            setSubmitting(true)
            await axios.post('/api/issues', data)
            router.push('/issues')
        } catch (error) {
            setSubmitting(false)
            setError('An unexpected problem occurred')
        }

    })}>
        <TextField.Root>
            <TextField.Input placeholder="Title" {...register('title')}/>
        </TextField.Root>
        <ErrorMessage>
            {errors.title?.message}
        </ErrorMessage>

        <Controller
        name="description"
        control={control}
        render={({field}) => <SimpleMDE placeholder="Describe the issue" {...field}/>}
        />
        <ErrorMessage>
            {errors.description?.message}
        </ErrorMessage>
        
        <Button disabled={isSubmitting}>Submit New Issue {isSubmitting && <Spinner/>} </Button>
    </form>
    </div>
  )
}

export default NewIssuePage