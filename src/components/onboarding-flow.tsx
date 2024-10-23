'use client';

import { use, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { Calendar } from '@/components/ui/calendar';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { z } from 'zod';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from './ui/form';
import { Toggle } from './ui/toggle';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { locations } from '@/lib/constants';
import { PromptManager } from './prompt-manager';

import { PhotoManager } from './photo-manager';
import Image from 'next/image';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Ім`я має бути не менше 2 символів',
  }),
  dateOfBirth: z.date().min(new Date(2006, 0, 1), {
    message: 'Ви повинні бути від 1974 року',
  }),
  denomination: z.enum([
    'Католізм',
    "Православ'я",
    'Євангелізм',
    'Баптизм',
    "П'ятидесятництво",
    'Неконфесійна',
    'Інше',
  ]),
  gender: z.enum(['male', 'female']),
  location: z.string(),
  custom_location: z.string().optional(),
});

const steps = [
  'Welcome',
  'Name',
  'Date of Birth',
  'Gender',
  'Denomination',
  'Location',
  'Prompts',
  'Finish',
];

export function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(6);
  const router = useRouter();

  const editUser = useMutation(api.users.updateUser);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      dateOfBirth: new Date(2007, 0, 17),
      gender: 'male',
      denomination: 'Інше',
      location: 'Київ',
      custom_location: '',
    },
  });

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(' here:');
    if (currentStep === steps.length) {
      const result = await editUser({
        name: values.name,
        gender: values.gender,
        denomination: values.denomination,
        location: values.location,
        dob: values.dateOfBirth.toLocaleDateString('uk-UA').toString(),
        custom_location: values.custom_location || '',
        onboarded: true,
        verified: false,
      });

      console.log('result :', result);
      // Optionally, redirect the user after successful submission
      router.push('/');
    } else {
      nextStep();
    }
  }

  const handleNextStep = () => {
    if (isStepValid()) {
      if (currentStep === steps.length) {
        form.handleSubmit(onSubmit)();
      } else {
        nextStep();
      }
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <WelcomeStep />;
      case 1:
        return <NameStep />;
      case 2:
        return <DateOfBirthStep />;
      case 3:
        return <GenderStep />;
      case 4:
        return <DenominationStep />;
      case 5:
        return <LocationStep />;
      case 6:
        return <PromptStep />;
      case 7:
        return <PhotoStep />;
      case 8:
        return <FinishStep />;
      default:
        return null;
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return true;
      case 1:
        return (
          form.getFieldState('name').isDirty &&
          !form.getFieldState('name').invalid
        );
      case 2:
        return !!form.getValues('dateOfBirth');
      case 3:
        return !!form.getValues('gender');
      case 4:
        return !!form.getValues('denomination');
      case 5:
        return !!form.getValues('location');
      case 6:
        // The PromptManager now handles its own validation
        return true;
      case 7:
        return true;
      case 8:
        return true;
      default:
        return true;
    }
  };

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <div className="flex flex-col h-[100svh] md:w-[500px] p-6 mx-auto rounded-lg max-w-md">
          <div className="flex items-center gap-4 mb-6">
            {currentStep > 1 && (
              <Button type="button" onClick={prevStep} variant="ghost">
                <ChevronLeft className="w-4 h-4 " />
              </Button>
            )}
            <span className="block text-sm text-gray-500 whitespace-nowrap">
              {currentStep} з 8
            </span>

            <div className="w-full h-2 bg-gray-200 rounded-full ">
              <div
                className="h-2 transition-all duration-300 ease-in-out bg-blue-600 rounded-full"
                style={{ width: `${(currentStep / 8) * 100}%` }}
              ></div>
            </div>
          </div>
          {renderStep()}
          {currentStep !== 6 && currentStep !== 7 && (
            <div className="flex justify-between mt-auto">
              <Button
                disabled={!isStepValid()}
                type="button"
                onClick={handleNextStep}
                className="ml-auto"
              >
                {currentStep === steps.length ? 'Завершити' : 'Далі'}
                {currentStep !== steps.length && (
                  <ChevronRight className="w-4 h-4 ml-2" />
                )}
              </Button>
            </div>
          )}
        </div>
      </Form>
    </FormProvider>
  );

  function WelcomeStep() {
    return (
      <div className="mt-20">
        <h1 className="mb-10 text-xl">
          Давайте спершу заповнимо базову інформацію
        </h1>
        <Image
          src="/start-onboarding.png"
          alt="start onboarding"
          width={500}
          height={500}
          className="rounded-md dark:bg-slate-300"
        />
      </div>
    );
  }

  function NameStep() {
    return (
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem className="self-center mt-20">
            <FormLabel className="text-4xl font-bold uppercase">
              Як вас звати?
            </FormLabel>
            <FormControl>
              <Input {...field} placeholder="Ваше ім'я" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  function DateOfBirthStep() {
    return (
      <FormField
        control={form.control}
        name="dateOfBirth"
        render={({ field }) => (
          <FormItem className="self-center mt-20">
            <FormLabel>Дата народження</FormLabel>
            <FormControl>
              <Calendar
                mode="single"
                startMonth={new Date(1977, 1)}
                endMonth={new Date(2006, 12)}
                selected={field.value}
                onSelect={(date) => field.onChange(date)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  function GenderStep() {
    return (
      <FormField
        control={form.control}
        name="gender"
        render={({ field }) => (
          <FormItem className="self-center mt-20">
            <FormLabel className="block mb-5 text-4xl font-bold uppercase">
              Стать
            </FormLabel>
            <FormControl>
              <div className="flex flex-col gap-8">
                <div className="flex items-center gap-2">
                  <Toggle
                    className="bg-accent data-[state=on]:bg-purple-400 data-[state=on]:text-white"
                    pressed={field.value === 'male'}
                    onClick={() => field.onChange('male')}
                    id="male"
                  >
                    Чоловіча
                  </Toggle>
                  <Toggle
                    className="bg-accent data-[state=on]:bg-purple-400 data-[state=on]:text-white"
                    pressed={field.value === 'female'}
                    onClick={() => field.onChange('female')}
                    id="female"
                  >
                    Жіноча
                  </Toggle>
                </div>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  function DenominationStep() {
    return (
      <FormField
        control={form.control}
        name="denomination"
        render={({ field }) => (
          <FormItem className="self-center mt-20">
            <FormLabel className="block mb-5 text-4xl font-bold uppercase">
              Ваша конфесія?
            </FormLabel>
            <FormControl>
              <div className="flex flex-col gap-8">
                <div className="flex flex-wrap items-center gap-3">
                  <Toggle
                    className="bg-accent font-semibold data-[state=on]:bg-purple-400 data-[state=on]:text-white"
                    pressed={field.value === 'Католізм'}
                    onClick={() => field.onChange('Католізм')}
                  >
                    Католізм
                  </Toggle>

                  <Toggle
                    className="bg-accent font-semibold data-[state=on]:bg-purple-400 data-[state=on]:text-white"
                    onClick={() => field.onChange("Православ'я")}
                    pressed={field.value === "Православ'я"}
                    id="ortho"
                  >
                    Православ&apos;я
                  </Toggle>

                  <Toggle
                    className="bg-accent font-semibold data-[state=on]:bg-purple-400 data-[state=on]:text-white"
                    onClick={() => field.onChange('Баптизм')}
                    pressed={field.value === 'Баптизм'}
                    id="baptist"
                  >
                    Баптизм
                  </Toggle>

                  <Toggle
                    className="bg-accent font-semibold data-[state=on]:bg-purple-400 data-[state=on]:text-white"
                    onClick={() => field.onChange("П'ятидесятництво")}
                    pressed={field.value === "П'ятидесятництво"}
                    id="pentecostal"
                  >
                    П&apos;ятидесятництво
                  </Toggle>

                  <Toggle
                    className="bg-accent font-semibold data-[state=on]:bg-purple-400 data-[state=on]:text-white"
                    onClick={() => field.onChange('Неконфесійна')}
                    pressed={field.value === 'Неконфесійна'}
                    id="nondeno"
                  >
                    Неконфесійна
                  </Toggle>

                  <Toggle
                    className="bg-accent font-semibold data-[state=on]:bg-purple-400 data-[state=on]:text-white"
                    onClick={() => field.onChange('Інше')}
                    pressed={field.value === 'Інше'}
                    id="other"
                  >
                    Інше
                  </Toggle>
                </div>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  function LocationStep() {
    return (
      <>
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem className="mt-20 ">
              <FormLabel className="block mb-5 text-4xl font-bold uppercase">
                Звідки ви?
              </FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Місто" />
                  </SelectTrigger>
                  <SelectContent className="overflow-y-auto max-h-[20rem]">
                    <SelectGroup>
                      {locations.map((item) => (
                        <SelectItem
                          key={item.value}
                          value={item.value}
                          className="flex items-center gap-2"
                        >
                          <span>{item.label}</span>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="custom_location"
          render={({ field }) => (
            <FormItem className="mt-4 ">
              <FormLabel className="block mb-5 text-xl font-bold uppercase">
                Або введіть ваш місто
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="w-[180px]"
                  {...field}
                  placeholder="Біла Церква"
                />
              </FormControl>
            </FormItem>
          )}
        />
      </>
    );
  }

  function PromptStep() {
    return <PromptManager onComplete={nextStep} />;
  }

  function PhotoStep() {
    return <PhotoManager onComplete={nextStep} onboarding={true} />;
  }

  function FinishStep() {
    return (
      <div className="mt-20">
        <h1 className="mb-10 text-4xl">Нарешті все готово!</h1>
        <Image
          src="/finish-onboarding.png"
          alt="finish onboarding"
          width={500}
          height={500}
          className="rounded-md dark:bg-slate-300"
        />
      </div>
    );
  }
}
