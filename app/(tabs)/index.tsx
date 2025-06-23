// App.tsx
import { useToast } from '@/context/ToastContext';
import React from 'react';
import { SafeAreaView, Button } from 'react-native';

const Example = () => {
  const { showToast } = useToast();

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
      <Button
        title="Show Success Toast"
        onPress={() =>
          showToast({
            message: 'Upload successful!',
            type: 'success',
            action: {
              label: 'Undo',
              onPress: () => console.log('Undo'),
            },
            position: 'center',
          })
        }
      />
    </SafeAreaView>
  );
};

export default Example
