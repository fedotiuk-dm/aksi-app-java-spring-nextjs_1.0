package com.aksi.domain.game.hibernate;

import java.io.Serializable;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.util.Objects;

import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.hibernate.usertype.UserType;

import com.aksi.domain.game.formula.CalculationFormulaEntity;

/**
 * Hibernate UserType for working with CalculationFormula through JSON
 */
public class CalculationFormulaUserType implements UserType<CalculationFormulaEntity> {

    private final CalculationFormulaJsonType jsonType = new CalculationFormulaJsonType();

    @Override
    public int getSqlType() {
        return Types.LONGVARCHAR; // TEXT column for JSON
    }

    @Override
    public Class<CalculationFormulaEntity> returnedClass() {
        return CalculationFormulaEntity.class;
    }

    @Override
    public boolean equals(CalculationFormulaEntity x, CalculationFormulaEntity y) {
        return Objects.equals(x, y);
    }

    @Override
    public int hashCode(CalculationFormulaEntity x) {
        return x != null ? x.hashCode() : 0;
    }

    @Override
    public CalculationFormulaEntity nullSafeGet(ResultSet rs, int position, SharedSessionContractImplementor session, Object owner) throws SQLException {
        String json = rs.getString(position);
        if (json == null) {
            return null;
        }
        return jsonType.fromString(json);
    }

    @Override
    public void nullSafeSet(PreparedStatement st, CalculationFormulaEntity value, int index, SharedSessionContractImplementor session) throws SQLException {
        if (value == null) {
            st.setNull(index, Types.LONGVARCHAR);
        } else {
            String json = jsonType.toString(value);
            st.setString(index, json);
        }
    }

    @Override
    public CalculationFormulaEntity deepCopy(CalculationFormulaEntity value) {
        if (value == null) {
            return null;
        }
        return jsonType.deepCopy(value);
    }

    @Override
    public boolean isMutable() {
        return true;
    }

    @Override
    public Serializable disassemble(CalculationFormulaEntity value) {
        return (Serializable) deepCopy(value);
    }

    @Override
    public CalculationFormulaEntity assemble(Serializable cached, Object owner) {
        return deepCopy((CalculationFormulaEntity) cached);
    }

    @Override
    public CalculationFormulaEntity replace(CalculationFormulaEntity detached, CalculationFormulaEntity managed, Object owner) {
        return deepCopy(detached);
    }
}
