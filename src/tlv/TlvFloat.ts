/**
 * @license
 * Copyright 2022 Project CHIP Authors
 * SPDX-License-Identifier: Apache-2.0
 */

import { DataReaderLE } from "../util/DataReaderLE";
import { DataWriterLE } from "../util/DataWriterLE";
import { TlvType, TlvCodec, TlvTag } from "./TlvCodec";
import { TlvSchema } from "./TlvSchema";

const FLOAT_RANGE = { min: -340282346638528859811704183484516925440.0, max: 340282346638528859811704183484516925440.0 };

/**
 * Schema to encode a float in TLV.
 * 
 * @see {@link MatterCoreSpecificationV1_0} § A.11.1
 */
 class FloatSchema extends TlvSchema<number> {
    constructor(
        private readonly min?: number,
        private readonly max?: number,
        private readonly type: TlvType.Float | TlvType.Double = TlvType.Double,
    ) {
        super();
    }

    /** @override */
    protected encodeTlv(writer: DataWriterLE, value: number, tag: TlvTag = {}): void {
        TlvCodec.writeTag(writer, this.type, tag);
        TlvCodec.writePrimitive(writer, this.type, value);
    }

    /** @override */
    protected decodeTlv(reader: DataReaderLE) {
        const { tag, type } = TlvCodec.readTagType(reader);
        if (type !== this.type) throw new Error(`Unexpected type ${type}.`);
        let value = TlvCodec.readPrimitive(reader, type);
        this.validate(value);
        return { tag, value };
    }

    /** @override */
    validate(value: number): void {
        if (this.min !== undefined && value < this.min) throw new Error(`Invalid value: ${value} is below the minimum, ${this.min}.`);
        if (this.max !== undefined && value > this.max) throw new Error(`Invalid value: ${value} is above the maximum, ${this.min}.`);
    }
}


/** Double TLV schema bounded by a min / max. */
export const TlvBoundedDouble = ({ min, max }: { min?: number, max?: number } = {}, type?: TlvType.Float | TlvType.Double) => new FloatSchema(min, max, type);

/** Float TLV schema. */
export const TlvFloat = TlvBoundedDouble(FLOAT_RANGE, TlvType.Float);

/** Double TLV schema. */
export const TlvDouble = TlvBoundedDouble();
