"use client";
import {
  useForm,
  useFieldArray,
  UseFormRegister,
  UseFieldArrayRemove,
  FieldErrors,
} from "react-hook-form";
import { Button, Tooltip } from "~/components";
import {
  HiOutlineXCircle,
  HiOutlinePlusCircle,
  HiOutlineMinusCircle,
} from "react-icons/hi";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const optionSchema = z.object({
  day: z.enum(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]),
  start_time: z
    .string()
    .regex(
      /^([0-1][0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/,
      "Invalid time format",
    ),
  room: z.string().min(1, { message: "Room is required" }),
  campus: z.string().min(1, { message: "Campus is required" }),
});
const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(120, { message: "Name must be less than 120 characters" }),
  code: z.string(),
  type: z.enum(["Lecture", "Tutorial", "Workshop", "Practical", "Other"]),
  duration: z.coerce
    .number()
    .gte(1, { message: "Duration must be at least 1 minute." })
    .lte(600, { message: "Duration must be less than than 600 minutes." }),
  options: z
    .array(optionSchema)
    .min(1, { message: "At least one option is required" }),
});

export default function ClassForm() {
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "Lecture",
      options: [
        {
          day: "Monday",
          start_time: "",
          room: "",
          campus: "",
        },
      ],
    },
  });
  const watchType = watch("type");
  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // TODO: Deal with this
    console.log(values);
  }
  return (
    <form className="contents space-y-7" onSubmit={handleSubmit(onSubmit)}>
      <div className=" space-y-2">
        <label
          className="ml-0.5 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          htmlFor="course_name"
        >
          Name
        </label>
        <input
          {...register("name")}
          id="course_name"
          placeholder="Name"
          className={`flex h-10 w-full rounded-md border ${
            errors.name && "border-red-300"
          } px-3 py-2 text-sm shadow-sm file:border-0 
          file:bg-transparent file:font-medium placeholder:text-neutral-500/90 ${
            errors.name
              ? " focus:ring-red-400/60"
              : " focus:ring-neutral-400/60"
          } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1
          disabled:cursor-not-allowed disabled:opacity-50`}
        />
        {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
        <p className="text-xs font-light text-neutral-500/90">
          This is the name of the class in plain text. For example, Full Stack
          Development.
        </p>
      </div>
      <div className=" space-y-2">
        <label
          className="ml-0.5 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          htmlFor="course_code"
        >
          Code
        </label>
        <input
          {...register("code")}
          id="course_code"
          placeholder="Code"
          className="flex h-10 w-full rounded-md border px-3 py-2 text-sm shadow-sm 
          file:border-0 file:bg-transparent file:font-medium
          placeholder:text-neutral-400/90 focus:ring-neutral-400/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1
          disabled:cursor-not-allowed disabled:opacity-50"
        />
        {errors.code && <ErrorMessage>{errors.code.message}</ErrorMessage>}
        <p className="text-xs font-light text-neutral-500/90">
          This is a code used to describe the course by the university
          (optional). For example, COSC2758.
        </p>
      </div>
      <div className=" space-y-2">
        <label
          className="ml-0.5 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          htmlFor="course_code"
        >
          Type
        </label>
        <select
          className=" flex h-10 w-full appearance-none rounded-md border bg-white px-3 py-2 text-sm shadow-sm
          disabled:cursor-not-allowed disabled:opacity-50"
          {...register("type")}
        >
          <option>Lecture</option>
          <option>Tutorial</option>
          <option>Workshop</option>
          <option>Practical</option>
          <option>Other</option>
        </select>
        <p className="text-xs font-light text-neutral-500/90">
          The type of class. For example, a Lecture or a Workshop.
        </p>
      </div>
      <div className="sticky top-0 z-50 inline-flex justify-between bg-white">
        <div className="space-y-1">
          <h3 className="text-lg font-medium">Options</h3>
          <p className="text-xs font-light text-neutral-500/90">
            This is the times and rooms on offer for this class this semester.
          </p>
        </div>
        <div className=" inline-flex gap-1">
          <Button
            variant="secondaryIcon"
            type="button"
            onClick={() => {
              for (let i = fields.length - 1; i > 0; i--) {
                remove(i);
              }
            }}
          >
            <HiOutlineXCircle /> Remove All
          </Button>

          <Button
            variant="secondary"
            type="button"
            onClick={() =>
              append({ day: "Monday", start_time: "", room: "", campus: "" })
            }
          >
            <HiOutlinePlusCircle /> Add Option
          </Button>
        </div>
      </div>
      <div className=" space-y-6">
        <div className=" w-full space-y-2">
          <label
            className="ml-0.5 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            htmlFor="duration"
          >
            Duration
          </label>
          <input
            {...register("duration")}
            id="duration"
            placeholder="Duration"
            type="number"
            className={`flex h-10 w-full rounded-md border ${
              errors.duration && "border-red-300"
            } px-3 py-2 text-sm shadow-sm file:border-0 
          file:bg-transparent file:font-medium placeholder:text-neutral-500/90 ${
            errors.duration
              ? " focus:ring-red-400/60"
              : " focus:ring-neutral-400/60"
          } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1
          disabled:cursor-not-allowed disabled:opacity-50`}
          />
          {errors.duration && (
            <ErrorMessage>{errors.duration.message}</ErrorMessage>
          )}
          <p className="text-xs font-light text-neutral-500/90">
            How long the {watchType} goes for in minutes.
          </p>
        </div>
        {errors.options && (
          <ErrorMessage>{errors.options.message}</ErrorMessage>
        )}
        {fields.map((fields, index) => (
          <div key={fields.id}>
            <OptionForm
              type={watchType}
              register={register}
              errors={errors}
              index={index}
              remove={remove}
            />
          </div>
        ))}
      </div>
      <div className="ml-auto space-x-5">
        <Button variant="outlineLarge" type="reset">
          Clear
        </Button>
        <Button variant="normalLarge">Add Class</Button>
      </div>
    </form>
  );
}

function OptionForm({
  type,
  register,
  errors,
  index,
  remove,
}: {
  type: "Lecture" | "Tutorial" | "Workshop" | "Practical" | "Other";
  register: UseFormRegister<z.infer<typeof formSchema>>;
  errors: FieldErrors<z.infer<typeof formSchema>>;
  index: number;
  remove: UseFieldArrayRemove;
}) {
  return (
    <div className="relative rounded-md border px-2.5 py-2 pb-3">
      {index !== 0 && (
        <div className="absolute right-1 top-1">
          <Tooltip message="Remove">
            <Button variant="ghostIcon" onClick={() => remove(index)}>
              <HiOutlineMinusCircle />
            </Button>
          </Tooltip>
        </div>
      )}
      <div className="space-y-7">
        <div className="flex flex-row space-x-10">
          <div className=" w-full space-y-2">
            <label
              className="ml-0.5 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              htmlFor="option_day"
            >
              Day
            </label>

            <select
              className=" flex h-10 w-full appearance-none rounded-md border bg-white px-3 py-2 text-sm shadow-sm
          disabled:cursor-not-allowed disabled:opacity-50"
              {...register(`options.${index}.day`)}
            >
              <option>Monday</option>
              <option>Tuesday</option>
              <option>Wednesday</option>
              <option>Thursday</option>
              <option>Friday</option>
            </select>
            {errors.options && (
              <ErrorMessage>{errors.options[index]?.day?.message}</ErrorMessage>
            )}
            <p className="text-xs font-light text-neutral-500/90">
              The day of the week.
            </p>
          </div>
          <div className=" w-full space-y-2">
            <label
              className="ml-0.5 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              htmlFor="start_time"
            >
              Start Time
            </label>
            <input
              {...register(`options.${index}.start_time`)}
              id="start_time"
              placeholder="Start time"
              type="time"
              className={`flex h-10 w-full rounded-md border ${
                errors.options &&
                errors.options[index]?.start_time &&
                "border-red-300"
              } px-3 py-2 text-sm shadow-sm file:border-0 
          file:bg-transparent file:font-medium placeholder:text-neutral-500/90 ${
            errors.options && errors.options[index]?.start_time
              ? " focus:ring-red-400/60"
              : " focus:ring-neutral-400/60"
          } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1
          disabled:cursor-not-allowed disabled:opacity-50`}
            />
            {errors.options && (
              <ErrorMessage>
                {errors.options[index]?.start_time?.message}
              </ErrorMessage>
            )}
            <p className="text-xs font-light text-neutral-500/90">
              The time the {type} starts.
            </p>
          </div>
        </div>

        <div className="flex flex-row space-x-10">
          <div className=" w-full space-y-2">
            <label
              className="ml-0.5 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              htmlFor="room"
            >
              Room
            </label>
            <input
              {...register(`options.${index}.room`)}
              id="room"
              placeholder="Room"
              className={`flex h-10 w-full rounded-md border ${
                errors.options &&
                errors.options[index]?.room &&
                "border-red-300"
              } px-3 py-2 text-sm shadow-sm file:border-0 
          file:bg-transparent file:font-medium placeholder:text-neutral-500/90 ${
            errors.options && errors.options[index]?.room
              ? " focus:ring-red-400/60"
              : " focus:ring-neutral-400/60"
          } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1
          disabled:cursor-not-allowed disabled:opacity-50`}
            />
            {errors.options && (
              <ErrorMessage>
                {errors.options[index]?.room?.message}
              </ErrorMessage>
            )}
            <p className="text-xs font-light text-neutral-500/90">
              What room the {type} will be in (if online write "-").
            </p>
          </div>
          <div className=" w-full space-y-2">
            <label
              className="ml-0.5 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              htmlFor="campus"
            >
              Campus
            </label>
            <input
              {...register(`options.${index}.campus`)}
              id="campus"
              placeholder="Campus"
              className={`flex h-10 w-full rounded-md border ${
                errors.options &&
                errors.options[index]?.campus &&
                "border-red-300"
              } px-3 py-2 text-sm shadow-sm file:border-0 
          file:bg-transparent file:font-medium placeholder:text-neutral-500/90 ${
            errors.options && errors.options[index]?.campus
              ? " focus:ring-red-400/60"
              : " focus:ring-neutral-400/60"
          } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1
          disabled:cursor-not-allowed disabled:opacity-50`}
            />
            {errors.options && (
              <ErrorMessage>
                {errors.options[index]?.campus?.message}
              </ErrorMessage>
            )}
            <p className="text-xs font-light text-neutral-500/90">
              What campus the {type} will be on. For example, RMIT students may
              write "Melbourne City" or "Canvas".
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ErrorMessage({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-red-500">{children}</p>;
}