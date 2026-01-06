import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Modal from '../UI/Modal';
import ModernInput from '../UI/ModernInput';
import ModernButton from '../UI/ModernButton';
import { UserPlusIcon } from '@heroicons/react/24/outline';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

const schema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  role: yup.string().required('Role is required'),
  organization: yup.string().when('role', {
    is: (role: string) => role !== 'individual' && role !== 'superadmin',
    then: (schema) => schema.required('Organization is required'),
    otherwise: (schema) => schema.optional(),
  }),
  plan: yup.string().required('Plan is required'),
  phone: yup.string().optional(),
  country: yup.string().optional(),
});

type FormData = yup.InferType<typeof schema>;

const AddUserModal: React.FC<AddUserModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false
}) => {


  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<FormData>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      role: 'individual',
      plan: 'starter',
    },
  });

  const watchedRole = watch('role');

  const handleFormSubmit = (data: FormData) => {
    onSubmit(data);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add New User"
      size="lg"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h4 className="text-md font-semibold text-gray-900 font-sf-pro">
            Basic Information
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ModernInput
              {...register('name')}
              label="Full Name"
              placeholder="Enter full name"
              error={errors.name?.message}
              required
            />

            <ModernInput
              {...register('email')}
              type="email"
              label="Email Address"
              placeholder="Enter email address"
              error={errors.email?.message}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ModernInput
              {...register('phone')}
              label="Phone Number"
              placeholder="Enter phone number"
              error={errors.phone?.message}
            />

            <ModernInput
              {...register('country')}
              label="Country"
              placeholder="Enter country"
              error={errors.country?.message}
            />
          </div>
        </div>

        {/* Role and Organization */}
        <div className="space-y-4">
          <h4 className="text-md font-semibold text-gray-900 font-sf-pro">
            Role & Organization
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 font-sf-pro-text mb-2">
                Role *
              </label>
              <select
                {...register('role')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent font-sf-pro-text"
              >
                <option value="individual">Individual</option>
                <option value="garage_user">Garage User</option>
                <option value="garage_admin">Garage Admin</option>
                <option value="insurer_user">Insurer User</option>
                <option value="insurer_admin">Insurer Admin</option>
                <option value="superadmin">Super Admin</option>
              </select>
              {errors.role && (
                <p className="mt-1 text-sm text-red-600 font-sf-pro-text">
                  {errors.role.message}
                </p>
              )}
            </div>

            {(watchedRole === 'garage_user' || watchedRole === 'garage_admin' ||
              watchedRole === 'insurer_user' || watchedRole === 'insurer_admin') && (
                <ModernInput
                  {...register('organization')}
                  label="Organization"
                  placeholder="Enter organization name"
                  error={errors.organization?.message}
                  required
                />
              )}
          </div>
        </div>

        {/* Plan */}
        <div className="space-y-4">
          <h4 className="text-md font-semibold text-gray-900 font-sf-pro">
            Subscription Plan
          </h4>

          <div>
            <label className="block text-sm font-medium text-gray-700 font-sf-pro-text mb-2">
              Plan *
            </label>
            <select
              {...register('plan')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent font-sf-pro-text"
            >
              <option value="starter">Starter</option>
              <option value="pro">Pro</option>
              <option value="enterprise">Enterprise</option>
            </select>
            {errors.plan && (
              <p className="mt-1 text-sm text-red-600 font-sf-pro-text">
                {errors.plan.message}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <ModernButton
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </ModernButton>
          <ModernButton
            type="submit"
            variant="gradient"
            loading={isLoading}
            className="bg-red-600 hover:bg-red-700"
          >
            <UserPlusIcon className="h-4 w-4 mr-2" />
            {isLoading ? 'Creating...' : 'Create User'}
          </ModernButton>
        </div>
      </form>
    </Modal>
  );
};

export default AddUserModal;


