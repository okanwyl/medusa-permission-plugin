import React, {createContext, useContext, useState} from 'react';
import {
    FocusModal,
    Input,
    Heading,
    Text,
    Button,
    Label,
    RadioGroup,
    DropdownMenu,
    IconButton,
    Badge
} from "@medusajs/ui";

type createPolicyModalContextType = {
    showNewPolicy: boolean;
    setShowNewPolicy: React.Dispatch<React.SetStateAction<boolean>>;
};


const CreatePolicyModalContext = createContext<createPolicyModalContextType | undefined>(undefined);


export const CreatePolicyModalProvider = ({children}) => {
    const [showNewPolicy, setShowNewPolicy] = useState(false);

    return (
        <CreatePolicyModalContext.Provider value={{showNewPolicy, setShowNewPolicy}}>
            {children}
        </CreatePolicyModalContext.Provider>
    );
};

// 3. Custom hook for convenience
export const useCreatePolicyModal = () => {
    return useContext(CreatePolicyModalContext);
};


export function CreatePolicyModal() {
    // State to store the input value
    const {showNewPolicy, setShowNewPolicy} = useCreatePolicyModal();

    const [policyName, setPolicyName] = useState('');
    const [description, setDescription] = useState('');
    const [method, setMethod] = useState('1');  // '1' being GET as default
    const [baseRouter, setBaseRouter] = useState('');
    const [customRegex, setCustomRegex] = useState('');

    const [errors, setErrors] = useState({})

    const validate = () => {
        let validationErrors = {...errors};
        if (!policyName.trim()) {
            // @ts-ignore
            validationErrors.policyName = "Key name is required.";
        } else {
            // @ts-ignore
            delete validationErrors.policyName
        }

        if (!description.trim()) {
            // @ts-ignore
            validationErrors.description = "Key name is required.";
        } else {
            // @ts-ignore
            delete validationErrors.description
        }


        if (!baseRouter.trim()) {
            // @ts-ignore
            validationErrors.baseRouter = "Key name is required.";
        } else {
            // @ts-ignore
            delete validationErrors.baseRouter
        }

        if (!customRegex.trim()) {
            // @ts-ignore
            validationErrors.customRegex = "Key name is required.";
        } else {
            // @ts-ignore
            delete validationErrors.customRegex
        }

        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0; // Return true if no errors

    }

    // Event handler for the Save button
    const handleSave = async () => {
        // Logic to send the keyName to an API or service
        // For example, using fetch:
        if (!validate()) {
            console.log(errors);
            return;
        }

        const response = await fetch('/api/keys', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: policyName,
                description: description,
                method: method,
                base_router: baseRouter,
                custom_regex: customRegex
            }),
        });

        if (response.ok) {
            console.log('Key saved successfully!');
            // Close the modal or any other post-save logic
            setShowNewPolicy(false);
        } else {
            console.error('Failed to save key.');
        }
    };

    return (
        <FocusModal
            open={showNewPolicy}
            onOpenChange={setShowNewPolicy}
        >
            <FocusModal.Content>
                <FocusModal.Header>
                    <Button onClick={handleSave}>Save</Button>
                </FocusModal.Header>
                <FocusModal.Body className="flex flex-col items-center py-16">
                    <div className="flex w-full max-w-lg flex-col gap-y-8">
                        <div className="flex flex-col gap-y-1">
                            <Heading>Create New Policy</Heading>
                            <Text className="text-ui-fg-subtle">
                                Create policy for your permissions. You can create multiple
                                policies to organize your permissions.
                            </Text>
                        </div>
                        <div className="flex flex-col gap-y-2">
                            <Label htmlFor="policy_name" className="text-ui-fg-subtle">
                                Policy name
                            </Label>
                            <Input
                                id="policy_name"
                                placeholder="Create Product Policy"
                                onChange={(e) => setPolicyName(e.target.value)}
                                // @ts-ignore
                                style={errors.policyName ? {borderColor: 'red'} : {}}
                            />
                            {/*@ts-ignore*/}
                            {errors.policyName && <div style={{color: 'red'}}>{errors.policyName}</div>}

                        </div>
                        <div className="flex flex-col gap-y-2">
                            <Label htmlFor="description" className="text-ui-fg-subtle">
                                Description(optional)
                            </Label>
                            <Input
                                id="description"
                                placeholder="Manages creating product workflow, if is this attached policy group can create products"
                                onChange={(e) => setDescription(e.target.value)}
                                // @ts-ignore
                                style={errors.description ? {borderColor: 'red'} : {}}
                            />
                            {/*@ts-ignore*/}
                            {errors.description && <div style={{color: 'red'}}>{errors.description}</div>}

                        </div>
                        <div className="flex flex-col gap-y-2">
                            <Label htmlFor="method" className="text-ui-fg-subtle">
                                Method
                            </Label>

                            {/*// @ts-ignore*/}
                            <RadioGroup value={method} onChange={(value) => {
                                console.log(value)
                            }}>
                                <div className="flex items-center gap-x-3">
                                    <RadioGroup.Item value="1" id="radio_1"/>

                                    <Badge
                                        color="green"
                                        rounded="full"
                                    >
                                        GET
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-x-3">
                                    <RadioGroup.Item value="2" id="radio_2" onClick={() => setMethod('2')}/>
                                    {/*<Label htmlFor="radio_2" weight="plus">*/}
                                    {/*    Radio 2*/}
                                    {/*</Label>*/}

                                    <Badge
                                        color="purple"
                                        rounded="full"
                                    >
                                        POST
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-x-3">
                                    <RadioGroup.Item value="3" id="radio_3" onClick={() => setMethod('3')}/>
                                    <Badge
                                        color="red"
                                        rounded="full"
                                    >
                                        DELETE
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-x-3">
                                    <RadioGroup.Item value="4" id="radio_4" onClick={() => setMethod('4')}/>
                                    <Badge
                                        color="blue"
                                        rounded="full"
                                    >
                                        PUT
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-x-3">
                                    <RadioGroup.Item value="5" id="radio_5" onClick={() => setMethod('5')}/>
                                    <Badge
                                        color="orange"
                                        rounded="full"
                                    >
                                        PATCH
                                    </Badge>
                                </div>
                            </RadioGroup>
                        </div>
                        <div className="flex flex-col gap-y-2">
                            <Label htmlFor="base_router" className="text-ui-fg-subtle">
                                Base Router
                            </Label>
                            <Text className="text-ui-fg-subtle">
                                Create policy for your permissions. You can create multiple
                                policies to organize your permissions.
                            </Text>
                            <Input
                                id="base_router"
                                placeholder="products"
                                onChange={(e) => setBaseRouter(e.target.value)}
                                // @ts-ignore
                                style={errors.baseRouter ? {borderColor: 'red'} : {}}
                            />
                            {/*@ts-ignore*/}
                            {errors.baseRouter && <div style={{color: 'red'}}>{errors.baseRouter}</div>}

                        </div>
                        <div className="flex flex-col gap-y-2">
                            <Label htmlFor="custom_regex" className="text-ui-fg-subtle">
                                Regex(optional)
                            </Label>
                            <Text className="text-ui-fg-subtle">
                                Create policy for your permissions. You can create multiple
                                policies to organize your permissions.
                            </Text>
                            <Input
                                id="custom_regex"
                                placeholder="^id_\d+$"
                                onChange={(e) => setCustomRegex(e.target.value)}
                                // @ts-ignore
                                style={errors.customRegex ? {borderColor: 'red'} : {}}
                            />
                            {/*@ts-ignore*/}
                            {errors.customRegex && <div style={{color: 'red'}}>{errors.customRegex}</div>}

                        </div>
                    </div>

                </FocusModal.Body>
            </FocusModal.Content>
        </FocusModal>
    );
}