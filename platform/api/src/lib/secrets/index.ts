import { env } from '../../config/env.js';
import { logger } from '../logger.js';
import { awsSecretStore, secretPathFor } from './awsSecretsManager.js';
import { memorySecretStore } from './memory.js';
import type { SecretStore } from './types.js';

export type { SecretStore, SecretRef, Credentials } from './types.js';
export { secretPathFor };

// Pick the physical backend once. `memory` is dev/test only — refuse it in prod so a
// misconfig can never silently drop real credentials into volatile memory.
function selectStore(): SecretStore {
  if (env.SECRETS_BACKEND === 'memory') {
    if (env.NODE_ENV === 'production') {
      throw new Error('SECRETS_BACKEND=memory is forbidden in production — use AWS Secrets Manager.');
    }
    logger.warn('SecretStore: using in-memory backend (dev/test only — secrets are volatile).');
    return memorySecretStore;
  }
  logger.info(
    { endpoint: env.SECRETS_ENDPOINT ?? 'aws (ambient)' },
    'SecretStore: AWS Secrets Manager backend',
  );
  return awsSecretStore;
}

export const secretStore: SecretStore = selectStore();
