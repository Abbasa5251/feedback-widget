import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "./ui/textarea";
import { StarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import tailwindStyles from "../index.css?inline";

const formSchema = z.object({
	name: z.string().max(50),
	email: z.string().email(),
	feedback: z.string().trim().min(2),
	rating: z.number().gte(0).lte(5),
});

function Widget({ projectId }: { projectId?: string }) {
	const [rating, setRating] = useState(0);
	const [submitted, setSubmitted] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			email: "",
			feedback: "",
			rating: rating,
		},
	});

	const { watch, setValue } = form;

	const onSelectStar = (index: number) => {
		setRating(index + 1);
		setValue("rating", index + 1);
	};

	useEffect(() => {
		const subscription = watch((value, { name }) => {
			if (name === "rating") {
				setRating(value.rating as number);
			}
		});
		return () => subscription.unsubscribe();
	}, [watch]);

	function onSubmit(values: z.infer<typeof formSchema>) {
		// fetch(`${import.meta.env.API_BASE_URL}/feedback`, {
		fetch(`https://clear-gnat-977.convex.site/feedback`, {
			method: "POST",
			body: JSON.stringify({
				...values,
				projectId: projectId,
			}),
			headers: {
				"Content-type": "application/json",
			},
		});
		console.log(values);
		setSubmitted(true);
	}

	return (
		<>
			<style>{tailwindStyles}</style>
			<div className="widget fixed bottom-4 right-4 z-50">
				<Popover>
					<PopoverTrigger asChild>
						<Button className="rounded-full text-lg shadow-lg hover:scale-105 transition-all duration-200">
							Feedback
						</Button>
					</PopoverTrigger>
					<PopoverContent className="widget rounded-lg bg-card p-4 shadow-lg w-full max-w-md">
						<style>{tailwindStyles}</style>
						{submitted ? (
							<div>
								<h3 className="text-lg font-bold">
									Thank you for your feedback!
								</h3>
								<p className="mt-4">
									We appreciate your feedback. It helps us
									improve our product and provide better
									service to our customers.
								</p>
							</div>
						) : (
							<div>
								<h3 className="text-lg font-bold">
									Send us your feedback
								</h3>
								<Form {...form}>
									<form
										onSubmit={form.handleSubmit(onSubmit)}
										className="space-y-2"
									>
										<div className="grid grid-cols-2 gap-4">
											<FormField
												control={form.control}
												name="name"
												render={({ field }) => (
													<FormItem>
														<FormLabel>
															Name
														</FormLabel>
														<FormControl>
															<Input
																placeholder="Enter your Name"
																{...field}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name="email"
												render={({ field }) => (
													<FormItem>
														<FormLabel>
															Email
														</FormLabel>
														<FormControl>
															<Input
																placeholder="Enter your Email"
																{...field}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>
										<FormField
											control={form.control}
											name="feedback"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														Feedback
													</FormLabel>
													<FormControl>
														<Textarea
															className="min-h-[100px]"
															placeholder="Tell us what you think"
															{...field}
														/>
													</FormControl>
												</FormItem>
											)}
										/>
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-2">
												{[...Array(5)].map((_, idx) => (
													<StarIcon
														key={idx}
														className={cn(
															"h-5 w-5 cursor-pointer",
															{
																"fill-primary":
																	rating >
																	idx,
																"fill-muted stroke-muted-foreground":
																	rating <=
																	idx,
															}
														)}
														onClick={() =>
															onSelectStar(idx)
														}
													/>
												))}
											</div>
											<Button type="submit">
												Submit
											</Button>
										</div>
									</form>
								</Form>
							</div>
						)}
					</PopoverContent>
				</Popover>
			</div>
		</>
	);
}

export default Widget;
