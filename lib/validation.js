import moment from "moment";
export function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export function validatePasswordComplexity(password) {
  const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return re.test(password);
}

export function validateMinLength(value, min) {
  return value.length >= min;
}

export function validateMaxLength(value, max) {
  return value.length <= max;
}

export function validateNotNull(value) {
  return (value !== null) & (value !== undefined) & (value !== "");
}

export function validateMoreThanZero(value) {
  return value > 0;
}

export function validateDateTimeStr(dateTimeStr) {
  return moment(dateTimeStr, "YYYY-MM-DD HH:mm", true).isValid();
}

export function validateDateStr(dateStr) {
  return moment(dateStr, "YYYY-MM-DD", true).isValid();
}

function validateLineItemUnit(lineId, unit, unitType, errors) {
  const lineUnitId = unit.lineUnitId;
  const lineUnitIdValid =
    validateNotNull(lineUnitId) & validateMoreThanZero(+lineUnitId);
  if (!lineUnitIdValid) {
    errors[`line-${lineId}-lineUnitId`] =
      `Error in Line Item ${lineId}: Invalid input for ${unitType}-${lineUnitId} lineUnitId.`;
  }
  const refLineIdValid =
    validateNotNull(unit.refLineId) & validateMoreThanZero(+unit.refLineId);
  if (!refLineIdValid) {
    errors[`line-${lineId}-refLineId`] =
      `Error in Line Item ${lineId}: Invalid input for ${unitType}-${lineUnitId} refLineId.`;
  }
  const pdtCodeValid = validateNotNull(unit.pdtCode);
  if (!pdtCodeValid) {
    errors[`line-${lineId}-pdtCode`] =
      `Error in Line Item ${lineId}: Invalid input for ${unitType}-${lineUnitId} pdtCode.`;
  }
  const pdtNameValid = validateNotNull(unit.pdtName);
  if (!pdtNameValid) {
    errors[`line-${lineId}-pdtName`] =
      `Error in Line Item ${lineId}: Invalid input for ${unitType}-${lineUnitId} pdtName.`;
  }
  const foreignNameValid = validateNotNull(unit.foreignName);
  if (!foreignNameValid) {
    errors[`line-${lineId}-foreignName`] =
      `Error in Line Item ${lineId}: Invalid input for ${unitType}-${lineUnitId} foreignName.`;
  }

  const uomValid = validateNotNull(unit.uom);
  if (!uomValid) {
    errors[`line-${lineId}-uom`] =
      `Error in Line Item ${lineId}: Invalid input for ${unitType}-${lineUnitId} uom.`;
  }

  const weightValid =
    validateNotNull(unit.uom) & validateMoreThanZero(+unit.weight);
  if (!weightValid) {
    errors[`line-${lineId}-weight`] =
      `Error in Line Item ${lineId}: Invalid input for ${unitType}-${lineUnitId} weight.`;
  }

  const quantityValid =
    validateNotNull(unit.uom) & validateMoreThanZero(+unit.quantity);
  if (!quantityValid) {
    errors[`line-${lineId}-quantity`] =
      `Error in Line Item ${lineId}: Invalid input for ${unitType}-${lineUnitId} quantity.`;
  }

  return errors;
}
export function validateProcessingDocument(lineItems) {
  let errors = {};

  for (const lineItem of lineItems) {
    const { lineId, inputs, outputs } = lineItem;
    const processedByValid =
      validateNotNull(lineItem.processedBy) &
      validateMoreThanZero(+lineItem.processedBy);

    if (!processedByValid) {
      errors[`line-${lineId}-processedBy`] =
        `Error in Line Item ${lineId}: Invalid input for processed by.`;
    }

    const processTypeValid =
      validateNotNull(lineItem.processType) &
      validateMoreThanZero(+lineItem.processedType);
    if (!processTypeValid) {
      errors[`line-${lineId}-processType`] =
        `Error in Line Item ${lineId}: Invalid input for process type.`;
    }

    const processStartValid =
      validateNotNull(lineItem.processStart) &
      validateDateTimeStr(lineItem.processStart);
    if (!processStartValid) {
      errors[`line-${lineId}-processStart`] =
        `Error in Line Item ${lineId}: Invalid input for process start.`;
    }

    const processEndValid =
      validateNotNull(lineItem.processStart) &
      validateDateTimeStr(lineItem.processStart);
    if (!processEndValid) {
      errors[`line-${lineId}-processEnd`] =
        `Error in Line Item ${lineId}: Invalid input for process end.`;
    }

    for (const input of inputs) {
      errors = validateLineItemUnit(lineId, input, "input", errors);
    }
    for (const output of outputs) {
      errors = validateLineItemUnit(lineId, output, "output", errors);
    }
  }

  return errors;
}
