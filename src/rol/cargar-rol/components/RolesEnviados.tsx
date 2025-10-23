import React from 'react';
import { ShowYDeleteRoles } from '../../../ROL-ECOyOP/components/ShowYDeleteRoles';
import { RolesEnviadosProps } from '../interfaces/RolesEnviadosProps';

export const RolesEnviados: React.FC<RolesEnviadosProps> = ({ periodo, modulo, deps }) => (
    <ShowYDeleteRoles periodo={periodo} modulo={modulo} deps={deps} />
);
